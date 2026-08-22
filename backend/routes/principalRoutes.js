const express = require("express");
const router = express.Router();
const Principal = require("../models/Principal");

// GET Principal Data
router.get("/", async (req, res) => {
  try {
    let principalData = await Principal.findOne().sort({ updatedAt: -1 });

    if (!principalData) {
      // Create default if none exists
      principalData = await Principal.create({
        name: "Dr. M. Aslam Khan",
        qualification: "PhD in Education Management",
        message:
          "It is my privilege to serve as the Principal of Government Degree College Gulabad. We are committed to academic excellence and holistic development of our students.",
        photo:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
        vision:
          "To become a center of excellence in higher education, producing skilled professionals who contribute to national development.",
        mission:
          "To provide quality education, foster critical thinking, and promote research and innovation among students and faculty.",
      });
    }

    res.json(principalData);
  } catch (err) {
    console.error("❌ Principal fetch error:", err);
    res.status(500).json({ message: "Failed to fetch principal data" });
  }
});

// POST/UPDATE Principal Data
router.post("/", async (req, res) => {
  try {
    const { name, qualification, message, photo, vision, mission } = req.body;

    let principal = await Principal.findOne();

    if (principal) {
      principal = await Principal.findByIdAndUpdate(
        principal._id,
        { name, qualification, message, photo, vision, mission },
        { new: true, runValidators: true },
      );
    } else {
      principal = new Principal({
        name,
        qualification,
        message,
        photo,
        vision,
        mission,
      });
      await principal.save();
    }

    res.json({
      success: true,
      data: principal,
      message: "Principal details updated successfully!",
    });
  } catch (err) {
    console.error("❌ Principal update error:", err);
    res.status(500).json({ message: "Failed to update principal details" });
  }
});

module.exports = router;
