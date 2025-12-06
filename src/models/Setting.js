const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  instituteName: { type: String, default: 'Quran Learning Institute' },
  instituteEmail: { type: String },
  institutePhone: { type: String },
  instituteAddress: { type: String },
  adminTimezone: { type: String, default: 'UTC' },
  defaultMeetingLink: { type: String },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
