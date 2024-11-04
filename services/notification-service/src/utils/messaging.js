const amqp = require("amqplib");
const {
  processNotification,
} = require("../controllers/notificationController");

const connectRabbitMQ = async (retryCount = 5, delay = 5000) => {
  while (retryCount > 0) {
    try {
      console.log(
        `Attempting to connect to RabbitMQ... Retries left: ${retryCount}`
      );
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertQueue("notifications");

      channel.consume("notifications", async (message) => {
        const content = JSON.parse(message.content.toString());
        console.log("Received notification:", content);

        await processNotification(content);

        channel.ack(message);
      });

      console.log(
        "Notification Service connected to RabbitMQ and listening for messages"
      );
      return; // Exit the function after a successful connection
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      retryCount--;

      if (retryCount > 0) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("Could not connect to RabbitMQ after multiple attempts.");
        process.exit(1); // Exit the process if all retry attempts fail
      }
    }
  }
};

module.exports = { connectRabbitMQ };
