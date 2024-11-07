require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const reviewRoutes = require("./routes/reviewRoutes");
const logger = require("./utils/logger");

const app = express();
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/reviews", reviewRoutes);

// Start server
const PORT = process.env.PORT || 8007;
app.listen(PORT, () => {
  logger.info(`Review Service running on port ${PORT}`);
});
