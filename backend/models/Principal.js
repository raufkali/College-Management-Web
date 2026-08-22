const mongoose = require('mongoose');

const principalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  qualification: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  photo: { 
    type: String, 
    required: false // Set to false if you want to allow a fallback placeholder on the frontend
  },
  vision: { 
    type: String, 
    required: true 
  },
  mission: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Principal', principalSchema);