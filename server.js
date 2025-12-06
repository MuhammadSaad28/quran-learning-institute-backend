// Local development server (alternative to netlify dev)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./netlify/functions/src/config/database');
const routes = require('./netlify/functions/src/routes');
const errorHandler = require('./netlify/functions/src/middlewares/errorHandler');
const { User } = require('./netlify/functions/src/models');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.use('/api', routes);
app.use(errorHandler);

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
  console.log(`Server running on http://localhost:${PORT}`);
  await createDefaultAdmin();
});
