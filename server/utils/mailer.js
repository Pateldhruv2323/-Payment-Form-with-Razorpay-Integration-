const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test the SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP is ready to send emails');
  }
});

module.exports = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Payment Form" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
};
