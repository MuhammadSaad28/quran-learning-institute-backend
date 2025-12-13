const { DemoRequest, Course, User, Student, ClassSchedule } = require('../models');
const { sendEmail } = require('../config/email');
const emailTemplates = require('../templates/email.templates');
const crypto = require('crypto');

const generateInitialSchedules = async (student, weeklySchedule) => {
  const dayMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
  const today = new Date();
  const schedules = [];

  for (let week = 0; week < 4; week++) {
    for (const slot of weeklySchedule) {
      const dayIndex = dayMap[slot.day];
      if (dayIndex === undefined) continue;

      const classDate = new Date(today);
      const daysUntilNext = (dayIndex - today.getDay() + 7) % 7;
      classDate.setDate(today.getDate() + daysUntilNext + (week * 7));
      
      if (classDate < today && week === 0) {
        classDate.setDate(classDate.getDate() + 7);
      }

      const [hours, minutes] = slot.time.split(':');
      classDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      schedules.push({
        studentId: student._id,
        courseId: student.courseId,
        dateTimeUTC: classDate,
        dateTimeUser: `${slot.day} at ${slot.time}`,
        status: 'scheduled',
      });
    }
  }

  if (schedules.length > 0) {
    await ClassSchedule.insertMany(schedules);
  }
};

const createDemoRequest = async (data) => {
  const course = await Course.findById(data.courseId);
  if (!course) throw { statusCode: 404, message: 'Course not found' };
  
  const demoRequest = await DemoRequest.create(data);
  
  await sendEmail(
    process.env.EMAIL_USER,
    'New Demo Class Request',
    emailTemplates.demoRequestAdmin({
      ...data,
      courseName: course.title,
      preferredSlotUTC: new Date(data.preferredSlotUTC).toUTCString(),
    })
  );
  
  return demoRequest;
};


const getAllDemoRequests = async (status) => {
  const filter = status ? { status } : {};
  return await DemoRequest.find(filter).populate('courseId', 'title').sort({ createdAt: -1 });
};

const getDemoRequestById = async (id) => {
  const request = await DemoRequest.findById(id).populate('courseId', 'title');
  if (!request) throw { statusCode: 404, message: 'Demo request not found' };
  return request;
};

const approveDemoRequest = async (id, data) => {
  const request = await DemoRequest.findById(id).populate('courseId', 'title');
  if (!request) throw { statusCode: 404, message: 'Demo request not found' };
  
  const finalSlotUTC = new Date(data.adminFinalSlotUTC);
  const finalSlotUser = data.adminFinalSlotUser || finalSlotUTC.toLocaleString('en-US', { 
    dateStyle: 'full', 
    timeStyle: 'short',
    timeZone: request.timezone 
  });
  
  request.adminFinalSlotUTC = finalSlotUTC;
  request.adminFinalSlotUser = finalSlotUser;
  request.meetingLink = data.meetingLink;
  request.adminNotes = data.adminNotes;
  request.status = 'approved';
  await request.save();
  
  await sendEmail(
    request.email,
    'Your Demo Class is Confirmed!',
    emailTemplates.demoApproved({
      name: request.name,
      courseName: request.courseId.title,
      finalSlotUser: finalSlotUser,
      timezone: request.timezone,
      meetingLink: data.meetingLink,
    })
  );
  
  return request;
};

const rejectDemoRequest = async (id, reason) => {
  const request = await DemoRequest.findByIdAndUpdate(id, { status: 'rejected', adminNotes: reason }, { new: true });
  if (!request) throw { statusCode: 404, message: 'Demo request not found' };
  return request;
};


const convertToStudent = async (id, scheduleData) => {
  const request = await DemoRequest.findById(id).populate('courseId', 'title');
  if (!request) throw { statusCode: 404, message: 'Demo request not found' };
  if (request.status === 'converted') throw { statusCode: 400, message: 'Already converted to student' };
  
  let user = await User.findOne({ email: request.email });
  const generatedPassword = crypto.randomBytes(4).toString('hex');
  
  if (!user) {
    user = await User.create({
      name: request.name,
      email: request.email,
      phone: request.phone,
      password: generatedPassword,
      timezone: request.timezone,
      country: request.country,
      role: 'student',
    });
  } else {
    user.password = generatedPassword;
    user.role = 'student';
    await user.save();
  }
  
  const student = await Student.create({
    userId: user._id,
    courseId: request.courseId._id,
    weeklySchedule: scheduleData.weeklySchedule,
    notes: scheduleData.notes,
    demoRequestId: request._id,
  });

  await generateInitialSchedules(student, scheduleData.weeklySchedule);
  
  request.status = 'converted';
  await request.save();
  
  await sendEmail(
    request.email,
    'Welcome to Quran Wisdom Academy!',
    emailTemplates.studentCredentials({
      name: request.name,
      email: request.email,
      password: generatedPassword,
      courseName: request.courseId.title,
      schedule: scheduleData.weeklySchedule,
      loginUrl: `${process.env.CLIENT_URL}/login`,
    })
  );
  
  return { user, student };
};

module.exports = { createDemoRequest, getAllDemoRequests, getDemoRequestById, approveDemoRequest, rejectDemoRequest, convertToStudent };
