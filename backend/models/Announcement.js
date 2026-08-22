const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: [true, 'Category is required'], 
    enum: {
      values: ['Admission', 'Exams', 'Events', 'Holidays', 'General'],
      message: '{VALUE} is not a valid announcement category'
    }
  },
  title: { 
    type: String, 
    required: [true, 'Announcement title is required'], 
    trim: true 
  },
  date: { 
    type: Date, 
    required: [true, 'Publication date is required'],
    default: Date.now // Seamlessly stamps today's date if not passed by the admin panel
  },
  details: { 
    type: String, 
    required: [true, 'Announcement details are required'], 
    trim: true 
  },
  // 👇 New fields mapped directly to support your updated frontend component
  extraDetails: { 
    type: String, 
    trim: true // Optional: Holds long-form instructions or text blocks
  },
  fileUrl: { 
    type: String, 
    trim: true // Optional: URL link to an uploaded PDF or document
  },
  imageUrl: { 
    type: String, 
    trim: true // Optional: URL link to an uploaded image/flyer scan
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Announcement', announcementSchema);