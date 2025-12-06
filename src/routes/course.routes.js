const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { protect, adminOnly } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { courseSchema, updateCourseSchema } = require('../validations/course.validation');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', protect, adminOnly, validate(courseSchema), courseController.createCourse);
router.put('/:id', protect, adminOnly, validate(updateCourseSchema), courseController.updateCourse);
router.delete('/:id', protect, adminOnly, courseController.deleteCourse);

module.exports = router;
