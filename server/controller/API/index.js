const express = require('express');
const router = express.Router();

// Import your user routes or other API routes
const userRoutes = require('./user-routes');

// Define API routes
router.use('/user', userRoutes);

// Export the router as a handler function for Vercel
module.exports = (req, res) => {
  const app = express();

  // Middleware setup (if needed)
  app.use(express.json());

  // Use the defined API routes
  app.use(router);

  // Handle the request using Express
  app(req, res);
};