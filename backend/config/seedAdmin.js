const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || "Administrator";

    if (!email || !password) {
      console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD is missing!");
      return;
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`✅ Admin already exists: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("=================================");
    console.log("✅ ADMIN CREATED");
    console.log(`Email: ${email}`);
    console.log("Password: [hidden]");
    console.log("=================================");
  } catch (error) {
    console.error("❌ Admin creation failed:", error);
  }
};

module.exports = seedAdmin;
