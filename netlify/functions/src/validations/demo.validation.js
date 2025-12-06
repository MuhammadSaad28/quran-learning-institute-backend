const Joi = require('joi');

const demoRequestSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  timezone: Joi.string().required(),
  preferredSlotUser: Joi.string().required(),
  preferredSlotUTC: Joi.date().required(),
  courseId: Joi.string().required(),
  preferredDate: Joi.string().allow(''),
  preferredTime: Joi.string().allow(''),
});

const approveDemoSchema = Joi.object({
  adminFinalSlotUTC: Joi.date().required(),
  adminFinalSlotUser: Joi.string().allow(''),
  meetingLink: Joi.string().required(),
  adminNotes: Joi.string().allow(''),
});

const convertStudentSchema = Joi.object({
  weeklySchedule: Joi.array().items(
    Joi.object({
      day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
      time: Joi.string().required(),
    })
  ).min(1).required(),
  notes: Joi.string().allow(''),
});

module.exports = { demoRequestSchema, approveDemoSchema, convertStudentSchema };
