require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/dbConfig");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
// Database connection
connectDB();

// Routes
app.use("/api/products", productRoutes);

module.exports = app;