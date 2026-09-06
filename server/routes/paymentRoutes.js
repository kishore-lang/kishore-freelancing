const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { handleWebhook } = require("../controllers/webhookController");

// POST /api/create-order
router.post("/create-order", createOrder);

// POST /api/verify-payment
router.post("/verify-payment", verifyPayment);

// POST /api/webhook/razorpay
router.post("/webhook/razorpay", handleWebhook);

module.exports = router;
