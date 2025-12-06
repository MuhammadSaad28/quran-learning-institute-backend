const Joi = require('joi');

const courseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  duration: Joi.string().required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().uri().allow(''),
  features: Joi.array().items(Joi.string()),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  isActive: Joi.boolean(),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  duration: Joi.string(),
  price: Joi.number().min(0),
  image: Joi.string().uri().allow(''),
  features: Joi.array().items(Joi.string()),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  isActive: Joi.boolean(),
});

module.exports = { courseSchema, updateCourseSchema };
