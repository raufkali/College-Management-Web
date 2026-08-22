const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  }, // e.g., "Computer science internal marks fall 2024,25"
  
  semester: { 
    type: String, 
    required: true,
    enum: [
      "1st Semester", 
      "2nd Semester", 
      "3rd Semester", 
      "4th Semester", 
      "5th Semester", 
      "6th Semester", 
      "7th Semester", 
      "8th Semester"
    ]
  }, // Ensures uniform naming parameters across front and backend components
  
  department: { 
    type: String, 
    default: "Computer Science",
    trim: true
  },
  
  session: { 
    type: String, 
    default: "2022-2026",
    trim: true
  },
  
  pdfUrl: { 
    type: String, 
    required: true 
  } // Stores the local server storage directory file path (e.g., "/uploads/171829-ledger.pdf")

}, { timestamps: true });

// CRITICAL INTEGRITY CONTROL:
// Prevents duplicate ledger uploads for the exact same batch timeline.
// This works perfectly with our .findOneAndUpdate() logic to overwrite old revisions cleanly.
resultSchema.index({ department: 1, session: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);