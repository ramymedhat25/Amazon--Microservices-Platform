require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConfig");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(express.json());

// For Stripe webhook handling
app.use(express.raw({ type: "application/json" }));

connectDB();

app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 8006;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));
