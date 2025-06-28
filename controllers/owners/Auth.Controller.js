const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Owner = require('../../models/owners/Owner.Model');

exports.signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const newOwner = new Owner({ name, email, password: hash, phone, role: 'owner' });
  await newOwner.save();
  res.status(201).json({ message: 'Owner registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email });
  if (!owner) return res.status(404).json({ message: 'Owner not found' });

  const match = await bcrypt.compare(password, owner.password);
  if (!match) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: owner._id, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
  res.json({ message: 'Logged in successfully' });
};
