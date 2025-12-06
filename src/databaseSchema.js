/**
 * DATABASE SCHEMA DOCUMENTATION
 * Quran Learning Institute - MongoDB Schema Design
 * 
 * This file documents the normalized MongoDB schema structure.
 */

const DatabaseSchema = {
  // Users Collection - Stores all user accounts (admin & students)
  Users: {
    name: 'String, required, trimmed',
    email: 'String, required, unique, lowercase',
    phone: 'String, trimmed',
    role: "String, enum: ['admin', 'student'], default: 'student'",
    password: 'String, required, hashed with bcrypt',
    timezone: "String, default: 'UTC'",
    country: 'String',
    isActive: 'Boolean, default: true',
    createdAt: 'Date, auto-generated',
    updatedAt: 'Date, auto-generated',
  },

  // Courses Collection - Available courses
  Courses: {
    title: 'String, required, trimmed',
    description: 'String, required',
    duration: 'String, required (e.g., "3 months")',
    price: 'Number, required',
    image: 'String, URL to course image',
    features: 'Array of Strings',
    level: "String, enum: ['beginner', 'intermediate', 'advanced']",
    isActive: 'Boolean, default: true',
    createdAt: 'Date, auto-generated',
    updatedAt: 'Date, auto-generated',
  },

  // DemoRequests Collection - Demo class booking requests
  DemoRequests: {
    name: 'String, required, trimmed',
    email: 'String, required, lowercase',
    phone: 'String, required',
    country: 'String, required',
    timezone: 'String, required',
    preferredSlotUser: 'String, required (user-friendly format)',
    preferredSlotUTC: 'Date, required (UTC timestamp)',
    courseId: 'ObjectId, ref: Course, required',
    adminFinalSlotUTC: 'Date (set by admin)',
    adminFinalSlotUser: 'String (user-friendly format)',
    meetingLink: 'String (Zoom/Meet link)',
    status: "String, enum: ['pending', 'approved', 'rejected', 'converted']",
    adminNotes: 'String',
    createdAt: 'Date, auto-generated',
    updatedAt: 'Date, auto-generated',
  },

  // Students Collection - Enrolled students (linked to Users)
  Students: {
    userId: 'ObjectId, ref: User, required',
    courseId: 'ObjectId, ref: Course, required',
    weeklySchedule: [
      {
        day: "String, enum: ['monday', 'tuesday', ..., 'sunday']",
        time: 'String (e.g., "14:00")',
      },
    ],
    startDate: 'Date, default: now',
    notes: 'String',
    demoRequestId: 'ObjectId, ref: DemoRequest (optional)',
    createdAt: 'Date, auto-generated',
    updatedAt: 'Date, auto-generated',
  },

  // ClassSchedule Collection - Individual class instances
  ClassSchedule: {
    studentId: 'ObjectId, ref: Student, required',
    courseId: 'ObjectId, ref: Course, required',
    dateTimeUTC: 'Date, required',
    dateTimeUser: 'String, required (user-friendly format)',
    meetingLink: 'String',
    status: "String, enum: ['scheduled', 'completed', 'cancelled']",
    reminderSent: 'Boolean, default: false',
    createdAt: 'Date, auto-generated',
    updatedAt: 'Date, auto-generated',
  },

  // Settings Collection - Institute settings (singleton)
  Settings: {
    instituteName: 'String',
    instituteEmail: 'String',
    institutePhone: 'String',
    instituteAddress: 'String',
    adminTimezone: 'String',
    defaultMeetingLink: 'String',
    socialLinks: {
      facebook: 'String',
      twitter: 'String',
      instagram: 'String',
      youtube: 'String',
    },
    createdAt: 'Date, auto-generated',
    updatedAt: 'Date, auto-generated',
  },
};

module.exports = DatabaseSchema;
