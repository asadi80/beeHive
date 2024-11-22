const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require("./controller");
require("dotenv").config();
const auth = require("./helper/auth");
const errorHandler = require("./helper/error-handler");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3000;
const subdomain = 'JAMDOMAIN';

// Middleware
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build'))); // Serve static files from React app

// Authentication middleware
app.use(auth());

// API routes
app.use(routes);

// Error handling middleware should be last
app.use(errorHandler);

// if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
// }

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Connect to the database and start the server
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

// Setup localtunnel
const localtunnel = require('localtunnel');
(async () => {
  const tunnel = await localtunnel({ 
    subdomain: subdomain, 
    port: PORT  // Use the defined PORT variable
  });
  console.log(`App available at: ${tunnel.url}`);
})();
