const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  name: String,
  location: String,
  city: String,
  gender: String, // boys, girls, common
  availableRooms: Number,
  totalRooms: Number,
  facilities: {
    food: Boolean,
    ac: Boolean,
    wifi: Boolean,
    geyser: Boolean,
  },
  images: [String],

  // 🌍 GeoJSON for location
  locationCoords: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

// 👇 Add 2dsphere index for geo queries
pgSchema.index({ locationCoords: '2dsphere' });

module.exports = mongoose.model('PG', pgSchema);
