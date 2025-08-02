const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // 🔐 Owner
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },

  // 🏠 Type of property
  type: {
    type: String,
    enum: ['pg', 'flat'],
    required: true,
  },

  // 📄 Common Fields (shared across PG / Flat / Hostel)
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String },
  rent: { type: Number, required: true },
  deposit: { type: String, required: true },
  totalRooms: { type: Number },
  availableRooms: { type: Number },

facilities: {
  food: { type: Boolean, default: false },
  ac: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  geyser: { type: Boolean, default: false },
  electricityBill: { type: Boolean, default: false },
  cleaning: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false },
  cctv: { type: Boolean, default: false },
  powerBackup: { type: Boolean, default: false },
  parking: { type: Boolean, default: false }
},

  images: [String],

  // 📍 GeoJSON Location
  locationCoords: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    }
  },

  // 🛌 PG Specific
  pgDetails: {
    gender: { type: String, enum: ['boys', 'girls', 'common'] },
    isSharing: { type: Boolean },
    sharingType: { type: String, enum: ['single', 'double', 'triple', 'four'] },
  },

  // 🏢 Flat Specific
  flatDetails: {
    bhk: { type: Number }, // 1, 2, 3...
    isFurnished: { type: Boolean },
  },


  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// 🌍 Enable location-based search
propertySchema.index({ locationCoords: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
