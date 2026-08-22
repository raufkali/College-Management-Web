const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Result = require('../models/Result');

// Configure multer to save files cleanly onto the server disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/results';
    // Automatically create the folder if it does not exist on the server
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a clean name using timestamp to avoid overriding files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ledger-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Enforce file checks to only allow valid PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only official PDF documents are accepted.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ─── ROUTE A: ADMIN UPLOADS OFFICIAL WHOLE-CLASS LEDGER PDF ───
router.post('/results/upload-pdf', upload.single('resultPdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF document file provided." });
    }

    // Capture the macro filtering parameters from your admin front-end dropdowns
    const department = req.body.department || "Computer Science";
    const session = req.body.session || "2022-2026";
    const semester = req.body.semester || "1st Semester";
    
    // Grab the relative link to where the file is stored on the disk
    const pdfPath = req.file.path;

    // Build the macro data structure
    const structuredLedger = {
      department,
      session,
      semester,
      pdfPath
    };

    // Clean Ledger Rule: If the admin uploads a new version for the exact same 
    // Department, Session, and Semester, it updates the file path. Otherwise, it makes a new entry.
    const finalRecord = await Result.findOneAndUpdate(
      { department, session, semester },
      structuredLedger,
      { upsert: true, new: true }
    );

    res.json({ 
      message: "Official class result ledger saved to disk storage successfully!", 
      data: finalRecord 
    });

  } catch (err) {
    console.error(err);
    // If a database error happens, safely clean up the uploaded file from the disk
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Internal Document Upload System Exception." });
  }
});

// ─── ROUTE B: STUDENT GROUP FILTER LOOKUP ───
router.get('/results/lookup', async (req, res) => {
  try {
    const { department, session, semester } = req.query;

    if (!department || !session || !semester) {
      return res.status(400).json({ message: "Missing required query lookup parameters." });
    }

    // Find the exact matching class ledger file path
    const record = await Result.findOne({ department, session, semester });

    if (!record) {
      return res.status(404).json({ message: "No corresponding class result ledger found." });
    }
    
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database retrieval exception." });
  }
});

module.exports = router;