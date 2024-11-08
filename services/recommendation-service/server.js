const express = require("express");
const connectDB = require("./config/db");
const recommendationRoutes = require("./routes/recommendationRoutes");
const logger = require("./utils/logger");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/recommendations", recommendationRoutes);

// Connect to Database
connectDB();

// Start server
const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
  logger.info(`Recommendation Service running on port ${PORT}`);
});
