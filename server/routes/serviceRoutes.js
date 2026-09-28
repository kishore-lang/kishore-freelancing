const express = require("express");
const { pool } = require("../config/database");
const { getRedisClient } = require("../config/redis");
const router = express.Router();

/**
 * Get all services
 */
router.get("/", async (req, res) => {
  try {
    const redis = getRedisClient();

    // 1. Try to fetch from Redis Cache
    if (redis) {
      const cachedServices = await redis.get("services_cache");
      if (cachedServices) {
        console.log("[Redis] Serving services from cache 🚀");
        return res.status(200).json({
          success: true,
          services: JSON.parse(cachedServices),
          source: "cache"
        });
      }
    }

    // 2. Cache miss or Redis unavailable - Fetch from PostgreSQL
    const client = await pool.connect();
    let services = [];
    
    try {
      const result = await client.query(`
        SELECT * FROM services 
        WHERE is_active = TRUE OR is_active IS NULL
        ORDER BY id ASC
      `);
      services = result.rows;
    } finally {
      client.release();
    }

    // 3. Save to Redis for next requests (Expires in 24 hours = 86400 seconds)
    if (redis) {
      await redis.setEx("services_cache", 86400, JSON.stringify(services));
      console.log("[Redis] Saved services to cache");
    }

    res.status(200).json({
      success: true,
      services: services,
      source: "database"
    });
    
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
