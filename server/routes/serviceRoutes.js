const express = require("express");
const { pool } = require("../config/database");
const router = express.Router();

/**
 * Get all services
 */
router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM services 
        ORDER BY id ASC
      `);

      res.status(200).json({
        success: true,
        services: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
