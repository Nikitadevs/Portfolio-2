// controllers/contactController.js

const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { google } = require('googleapis');
const logger = require('../utils/logger');

// OAuth2 Setup
const OAuth2 = google.auth.OAuth2;

const contactController = async (req, res, next) => {
  // Validate Inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, message } = req.body;

  // Create OAuth2 client
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID, // ClientID
    process.env.OAUTH_CLIENT_SECRET, // Client Secret
    'https://developers.google.com/oauthplayground' // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  try {
    const accessToken = await oauth2Client.getAccessToken();
    
    // Create transporter using OAuth2
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    logger.info('Email transporter verified successfully.');

    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender's name and email
      to: process.env.RECEIVER_EMAIL, // Receiver's email
      subject: 'New Contact Form Submission',
      text: `
        You have a new contact form submission:

        Name: ${name}
        Email: ${email}
        Message:
        ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully from ${email}`);
    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).json({ error: 'There was an error sending your message. Please try again later.' });
  }
};

module.exports = contactController;
