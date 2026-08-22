const mongoose = require("mongoose");
const seedAdmin = require("./seedAdmin");
const connectDB = async () => {
  try {
    // Default local MongoDB connection string
    const localURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

    console.log(`🔄 Connecting to local MongoDB at ${localURI}`);

    const conn = await mongoose.connect(localURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await seedAdmin();
    console.log(
      `🟢 Local MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`,
    );
    console.log(`📁 Database: ${conn.connection.name}`);

    // Connection events
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });
  } catch (error) {
    console.error(`🔴 Local Database Connection Error: ${error.message}`);
    console.error("💡 Make sure MongoDB is running locally (mongod)");
    process.exit(1);
  }
};

module.exports = connectDB;
