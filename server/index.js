require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getRazorpayStatus } = require("./config/razorpay");
const { initDatabase } = require("./config/initDatabase");
const paymentRoutes = require("./routes/paymentRoutes");
const { getWhatsAppStatus } = require("./services/notificationService");

const app = express();
const PORT = process.env.PORT || 5000;

// Configured allowed origins for CORS security
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
  "https://kishore-port.web.app",
  "https://portfolio-demo-14a3f.web.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile, curl, postman) or any local dev port
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
    ) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation: Access denied for this origin."));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-razorpay-signature", "X-Razorpay-Signature"],
};

// Apply Middlewares
app.use(cors(corsOptions));

// Configure Express JSON Body Parser with rawBody verification hook for Webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Root API Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Kishore Portfolio Backend API is running",
  });
});

// Health Check API Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

// Razorpay Status Endpoint (Safe - never exposes key secret)
app.get("/api/razorpay/status", (req, res) => {
  const status = getRazorpayStatus();
  res.status(200).json(status);
});

// Payment Routes (POST /api/create-order, POST /api/verify-payment, POST /api/webhook/razorpay)
app.use("/api", paymentRoutes);

// Admin Routes (Protected)
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Public Service Routes
const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/services", serviceRoutes);

// Contact Route
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// 404 Handler for Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Initialize Database & Start Express Server
const startServer = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    const waStatus = getWhatsAppStatus();
    console.log(`=================================`);
    console.log(`Backend Server running on port ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Razorpay Status: http://localhost:${PORT}/api/razorpay/status`);
    console.log(`Create Order: http://localhost:${PORT}/api/create-order`);
    console.log(`Verify Payment: http://localhost:${PORT}/api/verify-payment`);
    console.log(`Webhook Endpoint: http://localhost:${PORT}/api/webhook/razorpay`);
    console.log(`---------------------------------`);
    console.log(`WhatsApp Provider: ${waStatus.provider}`);
    console.log(`WhatsApp Configured: ${waStatus.configured}`);
    if (waStatus.provider === "meta") {
      console.log(`WhatsApp API Version: ${waStatus.apiVersion}`);
      console.log(`Access Token Configured: ${waStatus.accessTokenConfigured}`);
      console.log(`Phone Number ID Configured: ${waStatus.phoneNumberIdConfigured}`);
    }
    console.log(`=================================`);
  });
};

startServer();
