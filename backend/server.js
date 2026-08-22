const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;
// ==========================================
// MIDDLEWARE
// ==========================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

// ==========================================
// ROUTES
// ==========================================
app.use("/api/auth", require("./routes/authRoutes"));

// Faculty routes
app.use("/api/faculty", require("./routes/facultyRoutes"));

// Announcement routes
app.use("/api/announcements", require("./routes/announcementRoutes"));

// Department routes
app.use("/api/departments", require("./routes/departmentRoutes"));

// Media routes
app.use("/api/media", require("./routes/mediaRoutes"));

// Principal routes
app.use("/api/principal", require("./routes/principalRoutes"));

// Result routes (includes /results, /results/upload-pdf, /results/semester/:semester)
app.use("/api", require("./routes/resultRoutes"));

// ==========================================
// ERROR HANDLING
// ==========================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log("Server Started on PORT:", PORT);
});
