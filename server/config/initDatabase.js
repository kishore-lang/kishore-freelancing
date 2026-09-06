const { pool } = require("./database");

/**
 * Initializes PostgreSQL database tables and seeds initial freelancing services.
 * Uses CREATE TABLE IF NOT EXISTS and ON CONFLICT to ensure idempotency.
 */
const initDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log("🐘 Connected to PostgreSQL database successfully.");

    try {
      await client.query("BEGIN");

      // 1. Table: customers
      await client.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          whatsapp_number VARCHAR(30),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Table: services
      await client.query(`
        CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          service_key VARCHAR(100) UNIQUE NOT NULL,
          service_name VARCHAR(255) NOT NULL,
          price NUMERIC(10,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Table: orders
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          customer_id INTEGER REFERENCES customers(id),
          service_id INTEGER REFERENCES services(id),
          requirements TEXT,
          amount NUMERIC(10,2) NOT NULL,
          currency VARCHAR(10) DEFAULT 'INR',
          status VARCHAR(50) DEFAULT 'created',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. Table: razorpay_orders
      await client.query(`
        CREATE TABLE IF NOT EXISTS razorpay_orders (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
          amount INTEGER NOT NULL,
          currency VARCHAR(10) DEFAULT 'INR',
          status VARCHAR(50) DEFAULT 'created',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 5. Table: payments
      await client.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          razorpay_order_id VARCHAR(255) NOT NULL,
          razorpay_payment_id VARCHAR(255) UNIQUE NOT NULL,
          razorpay_signature TEXT,
          verification_status VARCHAR(50) DEFAULT 'pending',
          notification_status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await client.query(`
        ALTER TABLE payments ADD COLUMN IF NOT EXISTS notification_status VARCHAR(50) DEFAULT 'pending';
      `);

      // 6. Table: webhook_logs (For Webhook Idempotency Tracking)
      await client.query(`
        CREATE TABLE IF NOT EXISTS webhook_logs (
          id SERIAL PRIMARY KEY,
          event_id VARCHAR(255) UNIQUE NOT NULL,
          event_type VARCHAR(100) NOT NULL,
          payload JSONB,
          processed BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 7. Seed Services (Idempotent seed using ON CONFLICT)
      await client.query(`
        INSERT INTO services (service_key, service_name, price) VALUES
        ('portfolio', 'Portfolio Website', 2000.00),
        ('react', 'React Website', 3000.00),
        ('ecommerce', 'E-Commerce Website', 8000.00),
        ('fullstack', 'Full-Stack Web Application', 10000.00),
        ('api', 'API / Backend Integration', 4000.00),
        ('test', 'Test Package', 5.00),
        ('custom', 'Custom Project', NULL)
        ON CONFLICT (service_key) DO UPDATE SET
          service_name = EXCLUDED.service_name,
          price = EXCLUDED.price;
      `);

      await client.query("COMMIT");
      console.log("🌱 Database tables verified (with notification_status) and 6 freelancing services seeded successfully.");
      return true;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error creating database tables or seeding:", err.message);
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.warn("⚠️ PostgreSQL Connection Warning:", error.message);
    console.warn("ℹ️ Running in memory-fallback mode for local preview if database is not active.");
    return false;
  }
};

module.exports = {
  initDatabase,
};
