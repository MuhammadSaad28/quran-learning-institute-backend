const connectDB = require('./src/config/database');
const { generateWeeklySchedules } = require('./src/services/schedule.service');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    await generateWeeklySchedules();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Weekly schedules generated' }),
    };
  } catch (error) {
    console.error('Schedule generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
