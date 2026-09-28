const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { 
  getDashboardStats, 
  getRecentOrders, 
  addService, 
  deleteService, 
  sendInvoiceEmail 
} = require("../controllers/adminController");
const router = express.Router();

// Simple middleware to check ADMIN_PASSWORD
const verifyAdminPassword = ClerkExpressRequireAuth();

// Apply auth middleware to all admin routes
router.use(verifyAdminPassword);

// Routes
router.get("/stats", getDashboardStats);
router.get("/orders", getRecentOrders);
router.post("/services", addService);
router.delete("/services/:id", deleteService);
router.post("/send-invoice-email", sendInvoiceEmail);

// Simple verify route for the frontend to check if a password is correct
router.post("/verify-password", (req, res) => {
  res.status(200).json({ success: true, message: "Authenticated" });
});

module.exports = router;
