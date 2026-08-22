const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  hod: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  courses: { type: [String], required: true, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);