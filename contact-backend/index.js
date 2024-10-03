// index.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const contactRoutes = require('./routes/contact');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(helmet()); // Secure HTTP headers

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://nikitadev.netlify.app/']; // Default origin

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));

app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Global Error Handler
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
