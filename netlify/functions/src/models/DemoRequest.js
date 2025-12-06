const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  timezone: { type: String, required: true },
  preferredSlotUser: { type: String, required: true },
  preferredSlotUTC: { type: Date, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  adminFinalSlotUTC: { type: Date },
  adminFinalSlotUser: { type: String },
  meetingLink: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'converted'], default: 'pending' },
  adminNotes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('DemoRequest', demoRequestSchema);
