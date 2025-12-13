const scheduleService = require('../services/schedule.service');

const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getAllSchedules(req.query);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

const getMySchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getSchedulesByUserId(req.user._id);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

const getUpcomingSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getUpcomingSchedules(req.user._id);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const result = await scheduleService.deleteSchedule(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateClassStatus = async (req, res, next) => {
  try {
    const result = await scheduleService.updateClassStatus(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const rescheduleClass = async (req, res, next) => {
  try {
    const result = await scheduleService.rescheduleClass(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSchedules, getMySchedules, getUpcomingSchedules, createSchedule, updateSchedule, deleteSchedule, updateClassStatus, rescheduleClass };
