require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/dbConfig");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/inventory", inventoryRoutes);

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
  console.log(`Inventory service running on port ${PORT}`);
});
