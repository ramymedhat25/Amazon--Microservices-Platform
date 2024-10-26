const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/helpers");

exports.register = async (req, res) => {
try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, "Email already exists");
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Prepare user data for response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    console.log("User Data:", userData); // Debugging line to verify userData

    // Send the response with user data
    sendResponse(res, 201, "User registered successfully", userData);
  } catch (error) {
    console.error("Error:", error); // Log any errors
    sendResponse(res, 500, "Error registering user", { error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(res, 400, "Invalid credentials");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    sendResponse(res, 500, "Error logging in", { error: error.message });
  }
};
