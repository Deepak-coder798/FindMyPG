// Simulated SMS sender — logs to console
exports.sendPhoneOTP = async (phone, otp) => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 100));

  console.log(`📱 Simulated SMS OTP sent to ${phone}: ${otp}`);
};


// // utils/sendSMS.js
// const twilio = require('twilio');

// const client = twilio(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// exports.sendPhoneOTP = async (toPhone, otp) => {
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP code is: ${otp}`,
//       from: process.env.TWILIO_PHONE,
//       to: `+91${toPhone}`  // Change country code if needed
//     });

//     console.log('✅ SMS sent:', message.sid);
//   } catch (error) {
//     console.error('❌ Error sending SMS:', error);
//     throw new Error('Failed to send OTP via SMS');
//   }
// };
