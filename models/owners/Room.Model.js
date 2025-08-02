const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true },
  roomNumber: { type: String, required: true },
  sharingType: {
    type: String,
    enum: ['single', 'double', 'triple', 'four'],
    required: true
  },
  floorNumber:{type:Number, required:true},
  capacity: { type: Number, required: true }, // based on sharing type
  occupants: [{
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    bedNumber: Number
  }]
});

module.exports = mongoose.model('Room', roomSchema);
