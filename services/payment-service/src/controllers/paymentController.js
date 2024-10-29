const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("../utils/logger");

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
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const payment = await Payment.findOneAndUpdate(
        { paymentProviderId: paymentIntent.id },
        { status: "completed" },
        { new: true }
      );

      logger.info(`Payment completed for order ${payment.orderId}`, { orderId: payment.orderId, status: "completed" });
      res.status(200).send("Payment completed");

    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { paymentProviderId: paymentIntent.id },
        { status: "failed" }
      );

      logger.warn(`Payment failed for order ${paymentIntent.metadata.orderId}`, { orderId: paymentIntent.metadata.orderId, status: "failed" });
      res.status(200).send("Payment failed");
    }
  } catch (error) {
    logger.error(`Webhook error: ${error.message}`, { stack: error.stack });
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
