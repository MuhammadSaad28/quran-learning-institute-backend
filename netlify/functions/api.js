const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('./src/config/database');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Connect to database
let isConnected = false;
const connectOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Connect DB before handling requests
app.use(async (req, res, next) => {
  await connectOnce();
  next();
});

app.use('/api', routes);
app.use('/.netlify/functions/api', routes);
app.use(errorHandler);

module.exports.handler = serverless(app);
