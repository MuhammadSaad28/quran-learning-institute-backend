const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/courses', require('./course.routes'));
router.use('/demo-requests', require('./demo.routes'));
router.use('/students', require('./student.routes'));
router.use('/schedules', require('./schedule.routes'));
router.use('/settings', require('./setting.routes'));
router.use('/contact', require('./contact.routes'));

module.exports = router;
