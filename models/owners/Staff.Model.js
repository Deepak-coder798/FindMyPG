const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG' },
  pgOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  
  // ✅ Newly Added Fields
  passportImage: { type: String }, // URL or file path
  documents: [{ type: String }],   // Array of document URLs or paths
  salary: { type: Number },        // Monthly salary
  joiningDate: { type: Date },     // Date of joining
  
  // Optional extra fields
  address: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
