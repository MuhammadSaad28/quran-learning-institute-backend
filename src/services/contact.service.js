const { sendEmail } = require('../config/email');
const emailTemplates = require('../templates/email.templates');

const sendContactForm = async (data) => {
  await sendEmail(
    process.env.EMAIL_USER,
    `Contact Form: ${data.subject}`,
    emailTemplates.contactFormAdmin(data)
  );
  return { message: 'Message sent successfully' };
};

module.exports = { sendContactForm };
