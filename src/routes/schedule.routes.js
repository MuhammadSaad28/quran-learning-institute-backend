const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { protect, adminOnly } = require('../middlewares/auth');

router.get('/my', protect, scheduleController.getMySchedules);
router.get('/upcoming', protect, scheduleController.getUpcomingSchedules);
router.get('/', protect, adminOnly, scheduleController.getAllSchedules);
router.post('/', protect, adminOnly, scheduleController.createSchedule);
router.put('/:id', protect, adminOnly, scheduleController.updateSchedule);
router.delete('/:id', protect, adminOnly, scheduleController.deleteSchedule);

module.exports = router;
