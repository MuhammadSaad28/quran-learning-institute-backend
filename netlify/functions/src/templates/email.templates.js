const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a5f4a 0%, #0d3d2e 100%); color: #fff; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px; color: #333; line-height: 1.6; }
    .content h2 { color: #1a5f4a; margin-top: 0; }
    .info-box { background: #f8f9fa; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%); color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 10px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .schedule-item { background: #e8f5e9; padding: 10px 15px; margin: 5px 0; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☪ Quran Learning Institute</h1>
      <p>Illuminating Hearts with Divine Knowledge</p>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Quran Learning Institute. All rights reserved.</p>
      <p>May Allah bless your journey of learning.</p>
    </div>
  </div>
</body>
</html>`;


const demoRequestAdmin = (data) => baseTemplate(`
  <h2>New Demo Class Request</h2>
  <p>A new student has requested a demo class:</p>
  <div class="info-box">
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Country:</strong> ${data.country}</p>
    <p><strong>Timezone:</strong> ${data.timezone}</p>
    <p><strong>Course:</strong> ${data.courseName}</p>
    <p><strong>Preferred Time (User):</strong> ${data.preferredSlotUser}</p>
    <p><strong>Preferred Time (UTC):</strong> ${data.preferredSlotUTC}</p>
  </div>
  <p>Please review and approve this request from the admin panel.</p>
`);

const demoApproved = (data) => baseTemplate(`
  <h2>Your Demo Class is Confirmed! 🎉</h2>
  <p>Assalamu Alaikum ${data.name},</p>
  <p>Great news! Your demo class has been approved.</p>
  <div class="info-box">
    <p><strong>Course:</strong> ${data.courseName}</p>
    <p><strong>Date & Time:</strong> ${data.finalSlotUser}</p>
    <p><strong>Your Timezone:</strong> ${data.timezone}</p>
  </div>
  <p style="text-align: center;">
    <a href="${data.meetingLink}" class="btn">Join Meeting</a>
  </p>
  <p><strong>Meeting Link:</strong> ${data.meetingLink}</p>
  <p>Please join 5 minutes before the scheduled time. We look forward to meeting you!</p>
`);

const studentCredentials = (data) => baseTemplate(`
  <h2>Welcome to Quran Learning Institute! 🌟</h2>
  <p>Assalamu Alaikum ${data.name},</p>
  <p>Congratulations! You have been enrolled as a student. Here are your login credentials:</p>
  <div class="info-box">
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Password:</strong> ${data.password}</p>
    <p><strong>Course:</strong> ${data.courseName}</p>
  </div>
  <h3>Your Weekly Schedule:</h3>
  ${data.schedule.map(s => `<div class="schedule-item">📅 ${s.day.charAt(0).toUpperCase() + s.day.slice(1)} at ${s.time}</div>`).join('')}
  <p style="text-align: center;">
    <a href="${data.loginUrl}" class="btn">Login to Portal</a>
  </p>
  <p>Please change your password after first login.</p>
`);

const classReminder = (data) => baseTemplate(`
  <h2>Class Reminder ⏰</h2>
  <p>Assalamu Alaikum ${data.name},</p>
  <p>This is a reminder that your class is starting in 1 hour.</p>
  <div class="info-box">
    <p><strong>Course:</strong> ${data.courseName}</p>
    <p><strong>Time:</strong> ${data.classTime}</p>
  </div>
  ${data.meetingLink ? `<p style="text-align: center;"><a href="${data.meetingLink}" class="btn">Join Class</a></p>` : ''}
  <p>May your learning be blessed!</p>
`);

const contactFormAdmin = (data) => baseTemplate(`
  <h2>New Contact Form Submission</h2>
  <div class="info-box">
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
  </div>
  <h3>Message:</h3>
  <p>${data.message}</p>
`);

module.exports = { demoRequestAdmin, demoApproved, studentCredentials, classReminder, contactFormAdmin };
