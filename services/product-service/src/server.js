require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/dbConfig");
const productRoutes = require("./routes/productRoutes");

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Database connection
connectDB();

// Routes
app.use("/api/products", productRoutes);

//Start Server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});