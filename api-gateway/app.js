require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/dbConfig");
const userRoutes = require("./routes/userRoutes");

const app = express();

process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
