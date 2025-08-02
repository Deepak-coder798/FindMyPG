// models/Tenant.js

const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  // 📛 Basic Information
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  age: {
    type: Number
  },

  // 📸 Photo
  passportImage: {
    type: String, // Store URL or filename
    required: false
  },

  // 📎 Documents (e.g., ID proof, rent agreement, etc.)
  documents: {
    type: [String], // Array of URLs or filenames
    default: []
  },

  // 🏠 Property Relations
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },

  // 💵 Financial Info
  rent: {
    type: Number,
    required: true
  },
  deposit: {
    type: String,
    required: true
  },

  // 🗓️ Stay Duration
  moveInDate: {
    type: Date,
    default: Date.now
  },
  moveOutDate: {
    type: Date
  },

  // 🔐 Owner Link (optional, but useful for dashboard filters)
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner'
  },

  // 📅 Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tenant', tenantSchema);
