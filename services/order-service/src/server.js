require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/dbConfig");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
