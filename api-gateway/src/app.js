const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/gatewayRoutes");
const { logger } = require("./utils/logger.js");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", routes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
