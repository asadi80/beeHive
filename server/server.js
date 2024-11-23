const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./controller');
require('dotenv').config();
const auth = require('./helper/auth');
const errorHandler = require('./helper/error-handler');
const db = require('./config/connection');

const app = express();

// Middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());

// Authentication middleware
app.use(auth());

// API routes
app.use('/api', routes);  // Assuming your routes are under `/api`

// Error handling middleware should be last
app.use(errorHandler);

// Serve static React build files
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all route for React's client-side routing (for single-page apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Connect to DB and run API
db.once('open', () => {
  console.log('Connected to DB');
});

// Export the app for serverless deployment (Vercel handler)
module.exports = (req, res) => {
  app(req, res);  // Use Express to handle requests and responses
};
