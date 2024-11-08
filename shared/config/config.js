require("dotenv").config();

const config = {
  port: process.env.PORT || 8000,
  dbUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

module.exports = config;
