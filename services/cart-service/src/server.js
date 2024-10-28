require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig.js");
const cartRoutes = require("./routes/cartRoutes");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

require("./models/Product");

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 8005;
app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));
