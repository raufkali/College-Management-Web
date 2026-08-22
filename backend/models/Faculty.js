const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dept: { type: String, required: true, trim: true },
  qualification: { type: String, required: true, trim: true },
  experience: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  url: { type: String, required: true }, // Profile Photo Link
  bio: { type: String, default: "Dedicated educator serving GDC Gulabad." },
  office: { type: String, default: "Main Block Assembly" }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);