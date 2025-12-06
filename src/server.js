require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const { sendClassReminders, generateWeeklySchedules } = require('./services/schedule.service');
const { User } = require('./models');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/api', apiLimiter);
app.use('/api', routes);
app.use(errorHandler);

// Cron job for class reminders (every 15 minutes)
cron.schedule('*/15 * * * *', async () => {
  console.log('Running class reminder check...');
  const count = await sendClassReminders();
  console.log(`Sent ${count} reminders`);
});

// Cron job for generating weekly schedules (every Sunday at midnight)
cron.schedule('0 0 * * 0', async () => {
  console.log('Generating weekly schedules...');
  await generateWeeklySchedules();
});

// Create default admin if not exists
const createDefaultAdmin = async () => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    await User.create({
      name: 'Admin',
      email: 'admin@quranlearning.com',
      password: 'admin123',
      role: 'admin',
      timezone: 'UTC',
    });
    console.log('Default admin created: admin@quranlearning.com / admin123');
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createDefaultAdmin();
});
