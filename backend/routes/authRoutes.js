const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Real Registration Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "This email is already registered as an admin!",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Admin profile created successfully in MongoDB!",
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Database registration failure: " + err.message,
      });
  }
});

// Real Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid email or password credentials.",
        });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid email or password credentials.",
        });
    }

    res.json({ success: true, token: `mock-jwt-token-for-${user._id}` });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Database system login error." });
  }
});

module.exports = router;
