const express = require("express");
const { pool } = require("../config/database");
const router = express.Router();

// Fetch orders for a given phone number
router.get("/:phone/orders", async (req, res) => {
  try {
    const { phone } = req.params;
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT o.id, o.requirements, o.amount, o.status as order_status, o.created_at, 
               s.service_name, s.icon,
               p.verification_status, p.razorpay_payment_id
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN services s ON o.service_id = s.id
        LEFT JOIN razorpay_orders ro ON o.id = ro.order_id
        LEFT JOIN payments p ON ro.razorpay_order_id = p.razorpay_order_id
        WHERE c.whatsapp_number = $1
        ORDER BY o.created_at DESC
      `, [phone]);

      res.status(200).json({ success: true, orders: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Verify login or register new user
router.post("/login", async (req, res) => {
  try {
    const { phone, fullName, email } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number required" });
    }

    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");
      
      // Check if user exists
      let userRes = await client.query("SELECT * FROM customers WHERE whatsapp_number = $1", [phone]);
      
      if (userRes.rows.length > 0) {
        // User exists, return user
        await client.query("COMMIT");
        return res.status(200).json({ success: true, isNewUser: false, user: userRes.rows[0] });
      } else {
        // New user - require name and email to proceed
        if (!fullName || !email) {
          await client.query("ROLLBACK");
          return res.status(200).json({ success: true, isNewUser: true, message: "Profile completion required" });
        }
        
        // Check if email is already taken by another number
        const emailCheck = await client.query("SELECT * FROM customers WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({ success: false, message: "Email already exists with another account." });
        }

        // Insert new user
        const newUser = await client.query(`
          INSERT INTO customers (full_name, email, whatsapp_number)
          VALUES ($1, $2, $3) RETURNING *
        `, [fullName, email, phone]);
        
        await client.query("COMMIT");
        return res.status(201).json({ success: true, isNewUser: false, user: newUser.rows[0] });
      }
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
