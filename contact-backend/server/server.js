// server.js (Express.js Backend)

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/api/feedback', (req, res) => {
  const { error, feedback } = req.body;
  // TODO: Handle feedback, e.g., save to database or send an email
  console.log('Error:', error);
  console.log('Feedback:', feedback);
  res.status(200).json({ message: 'Feedback received' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
