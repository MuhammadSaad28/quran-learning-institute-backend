const mongoose = require('mongoose');

const weeklyScheduleSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  time: { type: String, required: true },
}, { _id: false });

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  weeklySchedule: [weeklyScheduleSchema],
  startDate: { type: Date, default: Date.now },
  notes: { type: String },
  demoRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DemoRequest' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
