const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public_html')));

// POST route to handle email submission
app.post('/submit-email', (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  // Restrict to allowed domains
  const allowedDomains = ['gmail.com', 'rediffmail.com','yahoo.com'];
  const emailDomain = email.split('@')[1];
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({ message: "Not a valid email address "});
  }

  // Read existing emails from the JSON file
  fs.readFile('emails.json', (err, data) => {
    if (err) {
      console.error('Error reading emails file:', err);
      return res.status(500).json({ message: 'Failed to save email.' });
    }

    let emails = [];
    try {
      emails = JSON.parse(data); // Parse the existing emails
    } catch (parseErr) {
      console.error('Error parsing emails:', parseErr);
    }

    // Check if the email is already in the list
    if (emails.includes(email)) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Add new email to the list
    emails.push(email);

    // Save the updated email list back to the JSON file
    fs.writeFile('emails.json', JSON.stringify(emails, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving emails:', writeErr);
        return res.status(500).json({ message: 'Failed to save email.' });
      }
      console.log('Email added:', email);
      res.status(200).json({ message: 'Thank you for registering!' });
    });
  });
});

// Simple email validation function
function validateEmail(email) {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log("Server is running on http://localhost:3000");
});