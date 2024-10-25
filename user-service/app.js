require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/dbConfig");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
