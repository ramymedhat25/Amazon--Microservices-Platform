const express = require("express");
const { getNotificationsByUser, processNotification } = require('../controllers/notificationController');

const router = express.Router();

// Endpoint to get all notifications for a specific user
router.get("/user/:userId", getNotificationsByUser);


router.post("/send", async (req, res) => {
  try {
    const { userId, message, type, channel } = req.body;
    await processNotification({ userId, message, type, channel });
    res.status(200).json({ message: "Notification processed and sent." });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification." });
  }
});

module.exports = router;
