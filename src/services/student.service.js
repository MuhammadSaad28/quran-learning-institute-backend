const { Student, User, ClassSchedule, Course } = require('../models');

const getAllStudents = async () => {
  return await Student.find()
    .populate('userId', 'name email phone timezone country isActive')
    .populate('courseId', 'title')
    .sort({ createdAt: -1 });
};

const getStudentById = async (id) => {
  const student = await Student.findById(id)
    .populate('userId', 'name email phone timezone country')
    .populate('courseId', 'title description duration');
  if (!student) throw { statusCode: 404, message: 'Student not found' };
  return student;
};

const getStudentByUserId = async (userId) => {
  const student = await Student.findOne({ userId })
    .populate('userId', 'name email phone timezone country')
    .populate('courseId', 'title description duration price features level');
  return student;
};

const updateStudent = async (id, data) => {
  const student = await Student.findByIdAndUpdate(id, data, { new: true })
    .populate('userId', 'name email phone timezone country')
    .populate('courseId', 'title');
  if (!student) throw { statusCode: 404, message: 'Student not found' };
  return student;
};

const deleteStudent = async (id) => {
  const student = await Student.findById(id);
  if (!student) throw { statusCode: 404, message: 'Student not found' };
  
  await ClassSchedule.deleteMany({ studentId: id });
  await Student.findByIdAndDelete(id);
  
  return { message: 'Student deleted successfully' };
};

const getStudentSchedule = async (userId) => {
  const student = await Student.findOne({ userId });
  if (!student) throw { statusCode: 404, message: 'Student not found' };
  
  const schedules = await ClassSchedule.find({ studentId: student._id, status: 'scheduled' })
    .populate('courseId', 'title')
    .sort({ dateTimeUTC: 1 });
  
  return { weeklySchedule: student.weeklySchedule, upcomingClasses: schedules };
};

const getNextClass = async (userId) => {
  const student = await Student.findOne({ userId });
  if (!student) return null;
  
  const nextClass = await ClassSchedule.findOne({
    studentId: student._id,
    status: 'scheduled',
    dateTimeUTC: { $gte: new Date() },
  })
    .populate('courseId', 'title')
    .sort({ dateTimeUTC: 1 });
  
  return nextClass;
};

const generateSchedulesForStudent = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw { statusCode: 404, message: 'Student not found' };
  
  // Delete future scheduled classes
  await ClassSchedule.deleteMany({ 
    studentId: student._id, 
    dateTimeUTC: { $gte: new Date() },
    status: 'scheduled'
  });
  
  // Generate new schedules
  const dayMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
  const today = new Date();
  const schedules = [];

  for (let week = 0; week < 4; week++) {
    for (const slot of student.weeklySchedule) {
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
  
  return { message: `Generated ${schedules.length} class schedules` };
};

const generateSchedulesForUser = async (userId) => {
  const student = await Student.findOne({ userId });
  if (!student) throw { statusCode: 404, message: 'Student not found' };
  return generateSchedulesForStudent(student._id);
};

module.exports = { getAllStudents, getStudentById, getStudentByUserId, updateStudent, deleteStudent, getStudentSchedule, getNextClass, generateSchedulesForStudent, generateSchedulesForUser };
