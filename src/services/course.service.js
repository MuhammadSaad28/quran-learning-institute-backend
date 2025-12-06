const { Course } = require('../models');

const getAllCourses = async (activeOnly = false) => {
  const filter = activeOnly ? { isActive: true } : {};
  return await Course.find(filter).sort({ createdAt: -1 });
};

const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw { statusCode: 404, message: 'Course not found' };
  return course;
};

const createCourse = async (data) => {
  return await Course.create(data);
};

const updateCourse = async (id, data) => {
  const course = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!course) throw { statusCode: 404, message: 'Course not found' };
  return course;
};

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw { statusCode: 404, message: 'Course not found' };
  return { message: 'Course deleted successfully' };
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
