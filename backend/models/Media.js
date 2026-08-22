const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['image', 'video'] 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['campus', 'events', 'sports'] 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  date: { 
    type: String, 
    required: true,
    default: "Recent" // Aligns with your frontend default fallback value
  }, 
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  url: { 
    type: String, 
    required: true 
    // Accepts either a remote URL string (e.g., https://...) 
    // or a Data URL string (e.g., data:image/jpeg;base64,...)
  }, 
  location: { 
    type: String, 
    default: "Main Campus" 
  }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);