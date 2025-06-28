const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Owner = require('../../models/owners/Owner.Model');
const { sendEmailOTP } = require('../../utils/SendEmail');
const { sendPhoneOTP } = require('../../utils/SendSMS');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // ✅ Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // ✅ Phone number validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // ✅ Password length check
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // ✅ Check if user already exists

    const existing = await Owner.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(409).json({ message: 'Email or phone already registered' });


    // ✅ Hash and Save
      const hashedPassword = await bcrypt.hash(password, 10);

    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();

    const owner = new Owner({
      name,
      email,
      phone,
      password: hashedPassword,
      emailOTP,
      emailOTPExpiry: Date.now() + 10 * 60 * 1000,
      phoneOTP,
      phoneOTPExpiry: Date.now() + 10 * 60 * 1000
    });

    await owner.save();
    await sendEmailOTP(email, emailOTP);
    await sendPhoneOTP(phone, phoneOTP); 

    res.status(201).json({ message: 'Email and phone OTP sent. Please verify both.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};


exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // ✅ Validate input
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/Phone and password are required' });
    }

    // ✅ Find owner by email OR phone
    const owner = await Owner.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found with provided email or phone' });
    }

    if (!owner.isEmailVerified || !owner.isPhoneVerified) {
       return res.status(403).json({
         message: 'Please verify both email and phone number before logging in.'
       });
    }



    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { id: owner._id, role: 'owner' },
      process.env.JWT_SECRET
    );

    // ✅ Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    // ✅ Success response
    res.status(200).json({
      message: 'Logged in successfully',
      token, // optional for frontend
      user: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};


exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  const owner = await Owner.findOne({
    email,
    emailOTP: otp,
    emailOTPExpiry: { $gt: Date.now() }
  });

  if (!owner) return res.status(400).json({ message: 'Invalid or expired email OTP' });

  owner.isEmailVerified = true;
  owner.emailOTP = undefined;
  owner.emailOTPExpiry = undefined;
  await owner.save();

  res.json({ message: 'Email verified successfully' });
};



exports.verifyPhone = async (req, res) => {
  const { phone, otp } = req.body;

  const owner = await Owner.findOne({
    phone,
    phoneOTP: otp,
    phoneOTPExpiry: { $gt: Date.now() }
  });

  if (!owner) return res.status(400).json({ message: 'Invalid or expired phone OTP' });

  owner.isPhoneVerified = true;
  owner.phoneOTP = undefined;
  owner.phoneOTPExpiry = undefined;
  await owner.save();

  res.json({ message: 'Phone number verified successfully' });
};



