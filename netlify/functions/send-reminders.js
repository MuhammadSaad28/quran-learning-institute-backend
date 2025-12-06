const connectDB = require('./src/config/database');
const { sendClassReminders } = require('./src/services/schedule.service');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    const count = await sendClassReminders();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Sent ${count} reminders` }),
    };
  } catch (error) {
    console.error('Reminder error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
