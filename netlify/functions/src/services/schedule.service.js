const { ClassSchedule, Student, User, Course, Setting } = require('../models');
const { sendEmail } = require('../config/email');
const emailTemplates = require('../templates/email.templates');

const createSchedule = async (data) => {
  return await ClassSchedule.create(data);
};

const getAllSchedules = async (filters = {}) => {
  const query = {};
  if (filters.studentId) query.studentId = filters.studentId;
  if (filters.status) query.status = filters.status;
  if (filters.startDate && filters.endDate) {
    query.dateTimeUTC = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
  }
  
  return await ClassSchedule.find(query)
    .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
    .populate('courseId', 'title')
    .sort({ dateTimeUTC: 1 });
};

const updateSchedule = async (id, data) => {
  const schedule = await ClassSchedule.findByIdAndUpdate(id, data, { new: true });
  if (!schedule) throw { statusCode: 404, message: 'Schedule not found' };
  return schedule;
};

const deleteSchedule = async (id) => {
  const schedule = await ClassSchedule.findByIdAndDelete(id);
  if (!schedule) throw { statusCode: 404, message: 'Schedule not found' };
  return { message: 'Schedule deleted' };
};


const sendClassReminders = async () => {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  const now = new Date();
  
  const upcomingClasses = await ClassSchedule.find({
    dateTimeUTC: { $gte: now, $lte: oneHourFromNow },
    status: 'scheduled',
    reminderSent: false,
  })
    .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email timezone' } })
    .populate('courseId', 'title');
  
  for (const schedule of upcomingClasses) {
    const student = schedule.studentId;
    const user = student.userId;
    
    await sendEmail(
      user.email,
      'Class Reminder - Starting in 1 Hour',
      emailTemplates.classReminder({
        name: user.name,
        courseName: schedule.courseId.title,
        classTime: schedule.dateTimeUser,
        meetingLink: schedule.meetingLink,
      })
    );
    
    await sendEmail(
      process.env.EMAIL_USER,
      'Class Reminder - Student Class in 1 Hour',
      emailTemplates.classReminder({
        name: `Admin (Student: ${user.name})`,
        courseName: schedule.courseId.title,
        classTime: new Date(schedule.dateTimeUTC).toUTCString(),
        meetingLink: schedule.meetingLink,
      })
    );
    
    schedule.reminderSent = true;
    await schedule.save();
  }
  
  return upcomingClasses.length;
};

const generateWeeklySchedules = async () => {
  const students = await Student.find().populate('userId', 'timezone');
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  for (const student of students) {
    for (const slot of student.weeklySchedule) {
      const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(slot.day);
      let classDate = new Date(today);
      classDate.setDate(today.getDate() + ((dayIndex - today.getDay() + 7) % 7));
      
      if (classDate <= today) classDate.setDate(classDate.getDate() + 7);
      if (classDate > nextWeek) continue;
      
      const [hours, minutes] = slot.time.split(':');
      classDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const existing = await ClassSchedule.findOne({
        studentId: student._id,
        dateTimeUTC: classDate,
      });
      
      if (!existing) {
        await ClassSchedule.create({
          studentId: student._id,
          courseId: student.courseId,
          dateTimeUTC: classDate,
          dateTimeUser: `${slot.day} ${slot.time}`,
        });
      }
    }
  }
};

const getSchedulesByUserId = async (userId) => {
  const student = await Student.findOne({ userId });
  if (!student) return [];
  
  return await ClassSchedule.find({ studentId: student._id })
    .populate('courseId', 'title')
    .sort({ dateTimeUTC: 1 });
};

const getUpcomingSchedules = async (userId) => {
  const student = await Student.findOne({ userId });
  if (!student) return [];
  
  return await ClassSchedule.find({
    studentId: student._id,
    dateTimeUTC: { $gte: new Date() },
    status: 'scheduled',
  })
    .populate('courseId', 'title')
    .sort({ dateTimeUTC: 1 })
    .limit(10);
};

const updateClassStatus = async (id, data) => {
  const schedule = await ClassSchedule.findById(id)
    .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email timezone' } })
    .populate('courseId', 'title');
  
  if (!schedule) throw { statusCode: 404, message: 'Schedule not found' };
  
  const oldStatus = schedule.status;
  schedule.status = data.status;
  if (data.notes) schedule.notes = data.notes;
  await schedule.save();
  
  const student = schedule.studentId;
  const user = student.userId;
  const userTimezone = user.timezone || 'UTC';
  
  // Format class time in user's timezone
  const classTimeFormatted = new Date(schedule.dateTimeUTC).toLocaleString('en-US', {
    timeZone: userTimezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  if (data.sendEmail !== false) {
    await sendEmail(
      user.email,
      `Class ${data.status === 'completed' ? 'Completed' : 'Marked as Absent'}`,
      emailTemplates.classStatusUpdate({
        name: user.name,
        courseName: schedule.courseId.title,
        classTime: classTimeFormatted,
        timezone: userTimezone,
        oldStatus,
        newStatus: data.status,
        notes: data.notes,
      })
    );
  }
  
  return schedule;
};

const rescheduleClass = async (id, data) => {
  const schedule = await ClassSchedule.findById(id)
    .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email timezone' } })
    .populate('courseId', 'title');
  
  if (!schedule) throw { statusCode: 404, message: 'Schedule not found' };
  
  const oldDateTimeUser = schedule.dateTimeUser;
  const student = schedule.studentId;
  const user = student.userId;
  const userTimezone = user.timezone || 'UTC';
  
  const newDateTimeUTC = new Date(data.newDateTime);
  // Convert to user's timezone for display
  const newDateTimeUserFormatted = newDateTimeUTC.toLocaleString('en-US', {
    timeZone: userTimezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  schedule.dateTimeUTC = newDateTimeUTC;
  schedule.dateTimeUser = newDateTimeUserFormatted;
  schedule.status = 'scheduled';
  schedule.reminderSent = false;
  if (data.notes) schedule.notes = data.notes;
  await schedule.save();
  
  if (data.sendEmail !== false) {
    await sendEmail(
      user.email,
      'Class Rescheduled',
      emailTemplates.classRescheduled({
        name: user.name,
        courseName: schedule.courseId.title,
        oldDateTime: oldDateTimeUser,
        newDateTime: newDateTimeUserFormatted,
        timezone: userTimezone,
        notes: data.notes,
      })
    );
  }
  
  return schedule;
};

module.exports = { createSchedule, getAllSchedules, getSchedulesByUserId, getUpcomingSchedules, updateSchedule, deleteSchedule, sendClassReminders, generateWeeklySchedules, updateClassStatus, rescheduleClass };
