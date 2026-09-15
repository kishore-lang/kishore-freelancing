const { pool } = require("../config/database");

/**
 * Get high-level stats for the admin dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      // 1. Total Revenue (from paid orders)
      const revenueResult = await client.query(`
        SELECT SUM(amount) as total_revenue 
        FROM orders 
        WHERE status = 'paid'
      `);
      const totalRevenue = revenueResult.rows[0].total_revenue || 0;

      // 2. Total Orders
      const ordersResult = await client.query(`SELECT COUNT(*) as total_orders FROM orders`);
      const totalOrders = ordersResult.rows[0].total_orders || 0;

      // 3. Total Customers
      const customersResult = await client.query(`SELECT COUNT(*) as total_customers FROM customers`);
      const totalCustomers = customersResult.rows[0].total_customers || 0;

      res.status(200).json({
        success: true,
        stats: {
          totalRevenue: parseInt(totalRevenue),
          totalOrders: parseInt(totalOrders),
          totalCustomers: parseInt(totalCustomers)
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get recent orders for the admin table
 */
const getRecentOrders = async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      // Fetch the last 50 orders with details
      const result = await client.query(`
        SELECT 
          o.id as internal_order_id,
          o.amount,
          o.status as order_status,
          o.created_at,
          c.full_name as customer_name,
          c.email as customer_email,
          s.service_name,
          p.razorpay_payment_id,
          p.verification_status
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN services s ON o.service_id = s.id
        LEFT JOIN razorpay_orders ro ON ro.order_id = o.id
        LEFT JOIN payments p ON p.razorpay_order_id = ro.razorpay_order_id
        ORDER BY o.created_at DESC
        LIMIT 50
      `);

      res.status(200).json({
        success: true,
        orders: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders
};
