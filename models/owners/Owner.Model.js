const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'owner' },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailOTP: String,
  emailOTPExpiry: Date,
  phoneOTP: String,
  phoneOTPExpiry: Date
});

module.exports = mongoose.model('Owner', ownerSchema);
