const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { formLimiter } = require('../middlewares/rateLimiter');

router.post('/', formLimiter, contactController.sendContactForm);

module.exports = router;
