const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const { protect, adminOnly } = require('../middlewares/auth');

router.get('/', settingController.getSettings);
router.put('/', protect, adminOnly, settingController.updateSettings);

module.exports = router;
