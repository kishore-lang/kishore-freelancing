const express = require("express");
const { getDashboardStats, getRecentOrders } = require("../controllers/adminController");
const router = express.Router();

// Simple middleware to check ADMIN_PASSWORD
const verifyAdminPassword = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not set in environment variables");
    return res.status(500).json({ success: false, message: "Server configuration error" });
  }

  // Get password from header
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== \`Bearer \${adminPassword}\`) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid password" });
  }

  next();
};

// Apply auth middleware to all admin routes
router.use(verifyAdminPassword);

// Routes
router.get("/stats", getDashboardStats);
router.get("/orders", getRecentOrders);

// Simple verify route for the frontend to check if a password is correct
router.post("/verify-password", (req, res) => {
  res.status(200).json({ success: true, message: "Authenticated" });
});

module.exports = router;
