// utils/sendEmail.js
const nodemailer = require('nodemailer');

exports.sendOTP = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"FindMyPG" <${process.env.SMTP_EMAIL}>`,
    to: toEmail,
    subject: 'Your OTP Verification Code',
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  });
};
