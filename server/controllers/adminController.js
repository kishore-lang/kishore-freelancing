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

/**
 * Add a new service/product
 */
const addService = async (req, res) => {
  try {
    const { service_name, description, icon, price } = req.body;
    
    if (!service_name) {
      return res.status(400).json({ success: false, message: "Service name is required" });
    }

    // Generate a simple key
    const service_key = service_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO services (service_key, service_name, description, icon, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [service_key, service_name, description || '', icon || 'Sparkles', price || null]);

      res.status(201).json({
        success: true,
        message: "Service added successfully",
        service: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete a service/product
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
      // First try to hard delete the service
      const result = await client.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }

      res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
      if (error.code === '23503') { 
        // PostgreSQL foreign_key_violation: Fallback to soft delete
        await client.query('UPDATE services SET is_active = FALSE WHERE id = $1', [id]);
        return res.status(200).json({ 
          success: true, 
          message: "Product hidden from website (soft-deleted to preserve existing customer order history)." 
        });
      }
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Send Automated HTML Invoice Email via Resend API
 */
const sendInvoiceEmail = async (req, res) => {
  try {
    const { Resend } = require("resend");
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return res.status(500).json({ success: false, message: "RESEND_API_KEY is not configured on server" });
    }

    const {
      customerEmail,
      customerName = "Valued Customer",
      invoiceNo = "INV-1001",
      invoiceDate = new Date().toISOString().split("T")[0],
      companyName = "K FREELANCING",
      companyPhone = "",
      companyEmail = "",
      companyAddress = "",
      companyGst = "",
      items = [],
      subtotal = 0,
      taxPercent = 0,
      taxAmount = 0,
      discountPercent = 0,
      discountAmount = 0,
      grandTotal = 0,
      paidAmount = 0,
      balanceDue = 0,
      upiId = "",
      notes = ""
    } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ success: false, message: "Customer email is required" });
    }

    const resend = new Resend(resendApiKey);

    // Format items table HTML
    const itemsTableRows = items.map((item, idx) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px; font-size: 13px; color: #4b5563;">${idx + 1}</td>
        <td style="padding: 10px; font-size: 13px; font-weight: bold; color: #111827;">${item.description || 'Service Item'}</td>
        <td style="padding: 10px; font-size: 13px; text-align: center; color: #4b5563;">${item.qty}</td>
        <td style="padding: 10px; font-size: 13px; text-align: right; color: #4b5563;">₹${Number(item.rate).toLocaleString()}</td>
        <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: bold; color: #111827;">₹${(Number(item.qty) * Number(item.rate)).toLocaleString()}</td>
      </tr>
    `).join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb; shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ef4444; padding-bottom: 20px; margin-bottom: 20px; }
          .title { color: #dc2626; font-size: 24px; font-weight: 900; margin: 0; }
          .badge { display: inline-block; background: #fef2f2; color: #991b1b; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 9999px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th { background: #111827; color: #ffffff; padding: 10px; font-size: 11px; text-align: left; text-transform: uppercase; }
          .totals-box { margin-top: 20px; float: right; width: 250px; font-size: 13px; }
          .totals-row { display: flex; justify-content: space-between; padding: 4px 0; color: #4b5563; }
          .grand-total { font-size: 16px; font-weight: 900; color: #dc2626; border-top: 2px solid #111827; padding-top: 8px; margin-top: 6px; }
          .clear { clear: both; }
          .footer { border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 15px; font-size: 11px; color: #6b7280; text-align: center; }
          .upi-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #065f46; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="margin-bottom: 20px;">
            <div style="float: left;">
              <h2 style="margin: 0; color: #111827; font-size: 20px;">${companyName}</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">${companyAddress}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Ph: ${companyPhone} | ${companyEmail}</p>
              ${companyGst ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #9ca3af;">GSTIN: ${companyGst}</p>` : ''}
            </div>
            <div style="float: right; text-align: right;">
              <h1 class="title">INVOICE</h1>
              <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: bold; color: #111827;">#${invoiceNo}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Date: ${invoiceDate}</p>
            </div>
            <div class="clear"></div>
          </div>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 12px;">
            <p style="margin: 0; font-weight: bold; color: #9ca3af; text-transform: uppercase; font-size: 10px;">Billed To:</p>
            <p style="margin: 4px 0 0 0; font-weight: bold; font-size: 14px; color: #111827;">${customerName}</p>
            <p style="margin: 2px 0 0 0; color: #4b5563;">${customerEmail}</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th style="border-radius: 6px 0 0 0;">#</th>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right; border-radius: 0 6px 0 0;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableRows}
            </tbody>
          </table>

          <div class="totals-box">
            <div class="totals-row"><span>Subtotal:</span> <span>₹${subtotal.toLocaleString()}</span></div>
            ${discountAmount > 0 ? `<div class="totals-row" style="color: #059669;"><span>Discount (${discountPercent}%):</span> <span>-₹${discountAmount.toLocaleString()}</span></div>` : ''}
            ${taxAmount > 0 ? `<div class="totals-row"><span>GST Tax (${taxPercent}%):</span> <span>+₹${taxAmount.toLocaleString()}</span></div>` : ''}
            <div class="totals-row" style="font-weight: bold; color: #111827;"><span>Grand Total:</span> <span>₹${grandTotal.toLocaleString()}</span></div>
            ${paidAmount > 0 ? `<div class="totals-row" style="color: #047857; font-weight: bold;"><span>Amount Paid:</span> <span>-₹${paidAmount.toLocaleString()}</span></div>` : ''}
            <div class="totals-row grand-total"><span>BALANCE DUE:</span> <span>₹${balanceDue.toLocaleString()}</span></div>
          </div>
          <div class="clear"></div>

          ${upiId ? `
            <div class="upi-box">
              <strong style="color: #065f46;">💳 Pay via UPI:</strong> Send payment to UPI ID: <strong>${upiId}</strong> (Payable Balance: <strong>₹${balanceDue > 0 ? balanceDue.toLocaleString() : grandTotal.toLocaleString()}</strong>)
            </div>
          ` : ''}

          <div class="footer">
            <p><strong>Terms & Notes:</strong> ${notes}</p>
            <p style="margin-top: 10px; font-size: 10px;">This is an automated invoice generated by ${companyName}.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const senderEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const emailResponse = await resend.emails.send({
      from: `${companyName} <${senderEmail}>`,
      to: [customerEmail],
      subject: `Invoice #${invoiceNo} from ${companyName}`,
      html: htmlContent
    });

    console.log("[RESEND INVOICE EMAIL SUCCESS]", emailResponse);

    res.status(200).json({
      success: true,
      message: `Invoice #${invoiceNo} successfully emailed to ${customerEmail}`,
      emailId: emailResponse.id
    });

  } catch (error) {
    console.error("Error sending invoice email via Resend:", error);
    res.status(500).json({ 
      success: false, 
      message: error?.message || "Failed to send automated invoice email" 
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  addService,
  deleteService,
  sendInvoiceEmail
};

