const { createLogger, format, transports } = require("winston");
const path = require("path");

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",  // Set the log level (default: "info")
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),  // Captures stack trace for errors
    format.json()  // Logs in JSON format for better structure
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),  // Colorize output for easier reading in the console
        format.simple()
      ),
    }),
    new transports.File({ filename: path.join(__dirname, "../../logs/error.log"), level: "error" }),
    new transports.File({ filename: path.join(__dirname, "../../logs/combined.log") }),
  ],
});

// If not in production, log stack traces to the console for easier debugging
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.exports = logger;
