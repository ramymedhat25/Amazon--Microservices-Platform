const amqp = require("amqplib");
const { processNotification } = require("../controllers/notificationController");

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue("notifications");

    channel.consume("notifications", async (message) => {
      const content = JSON.parse(message.content.toString());
      console.log("Received notification:", content);

      await processNotification(content);

      channel.ack(message);
    });

    console.log("Notification Service connected to RabbitMQ and listening for messages");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

module.exports = { connectRabbitMQ };
