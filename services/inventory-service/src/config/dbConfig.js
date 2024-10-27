const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected to Inventory Database");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res
      .status(500)
      .send("Server Error. Failed to connect to Inventory Database.");
    process.exit(1);
  }
};

module.exports = connectDB;
