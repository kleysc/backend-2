const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendPasswordResetEmail(email, token) {
  const resetLink = `${process.env.BASE_URL || 'http://localhost:5000'}/api/sessions/reset-password/${token}`;
  const html = `<p>Click the link below to reset your password. This link expires in one hour.</p><a href="${resetLink}">Reset Password</a>`;
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Password Reset',
    html
  });
}

module.exports = { sendPasswordResetEmail };
