const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("../utils/logger");
const axios = require("axios");

// Process payment request
exports.processPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      metadata: { orderId, userId: req.userId },
    });

    const payment = new Payment({
      userId: req.userId,
      orderId,
      amount,
      status: "pending",
      paymentProviderId: paymentIntent.id,
    });

    await payment.save();
    logger.info(`Payment initiated for order ${orderId} with amount $${amount}`, {
      userId: req.userId,
      orderId,
      amount,
    });
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error(`Failed to initiate payment: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: "Payment processing failed" });
  }
};

// Handle Stripe webhook events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    console.log("Webhook received:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      console.log("Order ID from webhook:", orderId);

      if (!orderId) {
        logger.error("Missing orderId in payment intent metadata", { paymentIntentId: paymentIntent.id });
        return res.status(400).send("Missing orderId in payment metadata");
      }

      // Update payment status in the Payment Service DB
      const payment = await Payment.findOneAndUpdate(
        { paymentProviderId: paymentIntent.id },
        { status: "completed" },
        { new: true }
      );

      if (payment) {
        logger.info(`Payment completed for order ${payment.orderId}`, { orderId: payment.orderId, status: "completed" });
      } else {
        logger.warn("Payment not found in database", { paymentProviderId: paymentIntent.id });
      }

      // HTTP request to update the order status
      try {
        await axios.put(`http://order-service-url/api/orders/${orderId}/status`, {
          status: "completed",
        });
        logger.info(`Order ${orderId} status updated to completed`);
      } catch (axiosError) {
        logger.error(`Failed to update order status for ${orderId}: ${axiosError.message}`, { stack: axiosError.stack });
      }

      res.status(200).send("Payment completed");

    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await Payment.findOneAndUpdate(
        { paymentProviderId: paymentIntent.id },
        { status: "failed" }
      );

      logger.warn(`Payment failed for order ${orderId}`, { orderId, status: "failed" });
      res.status(200).send("Payment failed");
    } else {
      logger.info(`Unhandled event type: ${event.type}`);
      res.status(200).send("Event type not handled");
    }

  } catch (error) {
    logger.error(`Webhook error: ${error.message}`, { stack: error.stack });
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
