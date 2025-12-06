const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  features: [{ type: String }],
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
