const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Result = require("../models/Result");

// ─── STABLE LOCAL DISK FILE STORAGE ENGINE ───
const uploadDir = path.join(__dirname, "../uploads/results");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "ledger-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// ─── PDF VALIDATION ───
function isPdf(file) {
  const validMimeTypes = ["application/pdf", "application/x-pdf"];
  const hasValidMime = validMimeTypes.includes(
    (file.mimetype || "").toLowerCase(),
  );
  const hasValidExtension =
    path.extname(file.originalname).toLowerCase() === ".pdf";
  return hasValidMime || hasValidExtension;
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (isPdf(file)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

function uploadWithErrorHandling(req, res, next) {
  upload.single("resultPdf")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ success: false, message: "PDF exceeds 15MB limit." });
      }
      return res
        .status(400)
        .json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Upload processing error." });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Only PDF files are accepted." });
    }
    next();
  });
}

// ─── GET ALL RESULTS (Admin) ───
router.get("/results", async (req, res) => {
  try {
    const files = await Result.find().sort({ updatedAt: -1 });
    return res.json({ success: true, data: files });
  } catch (err) {
    console.error("❌ Admin Ledger Listing Exception:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database retrieval exception occurred.",
    });
  }
});

// ─── UPLOAD RESULT PDF ───
router.post(
  "/results/upload-pdf",
  uploadWithErrorHandling,
  async (req, res) => {
    try {
      const { title, semester, department, session } = req.body;

      if (!title || !semester) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Title and semester are required.",
          });
      }

      const pdfUrl = `/uploads/results/${req.file.filename}`;

      const updatedRecord = await Result.findOneAndUpdate(
        {
          semester,
          department: department || "Computer Science",
          session: session || "2022-2026",
        },
        {
          title,
          pdfUrl,
          department: department || "Computer Science",
          session: session || "2022-2026",
          semester: semester,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      return res.json({
        success: true,
        message: "Result ledger uploaded successfully!",
        data: updatedRecord,
      });
    } catch (err) {
      console.error("❌ Upload Exception:", err.message);
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(500).json({
        success: false,
        message: "Failed to upload result ledger.",
        error: err.message,
      });
    }
  },
);

// ─── DELETE RESULT ───
router.delete("/results/:id", async (req, res) => {
  try {
    const record = await Result.findByIdAndDelete(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Ledger not found." });
    }
    if (record.pdfUrl) {
      const filePath = path.join(__dirname, "..", record.pdfUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("⚠️ Could not remove file:", err.message);
      });
    }
    return res.json({ success: true, message: "Ledger removed successfully." });
  } catch (err) {
    console.error("❌ Deletion Exception:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Could not delete ledger." });
  }
});

// ─── GET RESULTS BY SEMESTER (Public) ───
router.get("/results/semester/:semesterName", async (req, res) => {
  try {
    const semesterParam = req.params.semesterName;
    const files = await Result.find({ semester: semesterParam }).sort({
      updatedAt: -1,
    });
    return res.json({ success: true, data: files });
  } catch (err) {
    console.error("❌ Semester Query Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch semester results.",
    });
  }
});

module.exports = router;
