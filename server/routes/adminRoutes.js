const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { 
  getDashboardStats, 
  getRecentOrders, 
  addService, 
  deleteService, 
  sendInvoiceEmail,
  verifyServerSideAdminRole,
  getAdminUsers,
  toggleBlockUser,
  exportUsersCsv
} = require("../controllers/adminController");
const router = express.Router();

// 1. Verify authentication token
const verifyAdminAuth = ClerkExpressRequireAuth();
router.use(verifyAdminAuth);

// 2. Strict Server-Side Role Check: verifies role in user_roles table
router.use(verifyServerSideAdminRole);

// Stats & Orders Routes
router.get("/stats", getDashboardStats);
router.get("/orders", getRecentOrders);
router.post("/services", addService);
router.delete("/services/:id", deleteService);
router.post("/send-invoice-email", sendInvoiceEmail);

// User Management Routes (Protected by user_roles server-side check)
router.get("/users", getAdminUsers);
router.post("/users/:id/toggle-block", toggleBlockUser);
router.get("/users/csv", exportUsersCsv);

// Simple verify route for the frontend to check if a password is correct
router.post("/verify-password", (req, res) => {
  res.status(200).json({ success: true, message: "Authenticated as Admin" });
});

module.exports = router;
