require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/dbConfig");
const { connectRabbitMQ } = require("./utils/messaging");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

// Set up routes
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
