const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { appendContactToSheet } = require('../services/googleSheetsService');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // 1. Log to Google Sheets
    await appendContactToSheet({ name, email, message });

    // 2. Send email via Nodemailer if SMTP is configured
    const userEmail = process.env.SMTP_USER;
    const userPass = process.env.SMTP_PASS;

    if (userEmail && userPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: userEmail,
          pass: userPass
        }
      });

      const mailOptions = {
        from: userEmail,
        to: userEmail, // Send to yourself
        subject: `New Contact Form Submission from ${name}`,
        text: `You have received a new message from the contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Contact] Email sent successfully for ${email}`);
    } else {
      console.warn("[Contact] SMTP credentials missing, email notification skipped.");
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('[Contact Error]:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while sending the message.' });
  }
});

module.exports = router;
