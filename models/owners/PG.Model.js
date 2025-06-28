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
    wifi:Boolean,
    geyser:Boolean,
  },
  images: [String]
});

module.exports = mongoose.model('PG', pgSchema);
