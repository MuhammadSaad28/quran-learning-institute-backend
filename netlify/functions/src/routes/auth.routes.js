const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const { loginSchema, updateProfileSchema, changePasswordSchema } = require('../validations/auth.validation');

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, validate(updateProfileSchema), authController.updateProfile);
router.put('/change-password', protect, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
