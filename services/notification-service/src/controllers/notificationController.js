const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.processNotification = async ({ userId, message, type, channel }) => {
  try {
    // Save notification in pending status
    const notification = new Notification({ userId, message, type, channel, status: "pending" });
    await notification.save();

    // Send notification based on the specified channel
    if (channel === "email") {
      await transporter.sendMail({
        from: `"E-commerce Platform" <no-reply@example.com>`,
        to: "ramymedyou@gmail.com", // Replace with user email in production
        subject: "Notification",
        text: message
      });
      console.log("Email notification sent:", message);
    } else if (channel === "sms") {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: "+201090012501" // Replace with user phone number in production
      });
      console.log("SMS notification sent:", message);
    }

    // Update notification status to "sent" upon successful delivery
    notification.status = "sent";
    await notification.save();
  } catch (error) {
    console.error("Error processing notification:", error);

    // Update the saved notification status to "failed"
    await Notification.findByIdAndUpdate(notification._id, { status: "failed" });
  }
};

// Controller to retrieve notifications for a specific user
exports.getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
