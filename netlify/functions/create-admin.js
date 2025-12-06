const connectDB = require('./src/config/database');
const { User } = require('./src/models');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectDB();
    
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@quranlearning.com',
        password: 'admin123',
        role: 'admin',
        timezone: 'UTC',
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Default admin created: admin@quranlearning.com / admin123' }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Admin already exists' }),
    };
  } catch (error) {
    console.error('Admin creation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
