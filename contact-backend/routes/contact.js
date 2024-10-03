// routes/contact.js

const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const contactRateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

router.post(
  '/',
  contactRateLimiter,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ max: 50 })
      .withMessage('Name cannot exceed 50 characters.'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required.')
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required.')
      .isLength({ max: 500 })
      .withMessage('Message cannot exceed 500 characters.'),
  ],
  contactController
);

module.exports = router;
