const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for Product Service");
  } catch (error) {
    console.error("MongoDB connection failed for Product Service:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;