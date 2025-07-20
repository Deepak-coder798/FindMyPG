const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG' }, // Add PG reference
  pgOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
