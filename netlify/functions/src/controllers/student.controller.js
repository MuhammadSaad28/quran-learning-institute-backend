const studentService = require('../services/student.service');

const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const student = await studentService.getStudentByUserId(req.user._id);
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getMySchedule = async (req, res, next) => {
  try {
    const schedule = await studentService.getStudentSchedule(req.user._id);
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

const getNextClass = async (req, res, next) => {
  try {
    const nextClass = await studentService.getNextClass(req.user._id);
    res.json(nextClass);
  } catch (error) {
    next(error);
  }
};

const generateMySchedules = async (req, res, next) => {
  try {
    const result = await studentService.generateSchedulesForUser(req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const generateSchedules = async (req, res, next) => {
  try {
    const result = await studentService.generateSchedulesForStudent(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const result = await studentService.createStudentDirectly(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStudents, getStudentById, getMyProfile, updateStudent, deleteStudent, getMySchedule, getNextClass, generateMySchedules, generateSchedules, createStudent };
