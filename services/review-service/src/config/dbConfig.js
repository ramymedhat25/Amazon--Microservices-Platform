const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for Review Service");
  } catch (error) {
    console.error(
      "MongoDB connection failed for Review Service:",
      error.message
    );
    res.status(500).send("Server Error. Failed to connect to Review Database.");
    process.exit(1);
  }
};

module.exports = connectDB;
