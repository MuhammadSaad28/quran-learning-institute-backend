const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demo.controller');
const { protect, adminOnly } = require('../middlewares/auth');
const { formLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const { demoRequestSchema, approveDemoSchema, convertStudentSchema } = require('../validations/demo.validation');

router.post('/', formLimiter, validate(demoRequestSchema), demoController.createDemoRequest);
router.get('/', protect, adminOnly, demoController.getAllDemoRequests);
router.get('/:id', protect, adminOnly, demoController.getDemoRequestById);
router.put('/:id/approve', protect, adminOnly, validate(approveDemoSchema), demoController.approveDemoRequest);
router.put('/:id/reject', protect, adminOnly, demoController.rejectDemoRequest);
router.post('/:id/convert', protect, adminOnly, validate(convertStudentSchema), demoController.convertToStudent);

module.exports = router;
