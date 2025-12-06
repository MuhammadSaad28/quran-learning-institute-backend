const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { protect, adminOnly } = require('../middlewares/auth');

router.get('/me', protect, studentController.getMyProfile);
router.get('/me/schedule', protect, studentController.getMySchedule);
router.get('/me/next-class', protect, studentController.getNextClass);
router.post('/me/generate-schedules', protect, studentController.generateMySchedules);
router.get('/', protect, adminOnly, studentController.getAllStudents);
router.get('/:id', protect, adminOnly, studentController.getStudentById);
router.put('/:id', protect, adminOnly, studentController.updateStudent);
router.delete('/:id', protect, adminOnly, studentController.deleteStudent);
router.post('/:id/generate-schedules', protect, adminOnly, studentController.generateSchedules);

module.exports = router;
