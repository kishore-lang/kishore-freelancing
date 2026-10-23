const express = require("express");
const { pool } = require("../config/database");
const emailService = require("../services/emailService");
const { sendWhatsAppOtp, normalizeWhatsAppNumber } = require("../services/notificationService");

const router = express.Router();

// In-memory OTP storage with TTL (10 minutes)
const otpStore = new Map();

// Periodic cleanup of expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore.entries()) {
    if (val.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Normalizes identifier into lookup keys:
 * - If email: returns { isEmail: true, key: email.toLowerCase() }
 * - If phone: returns { isEmail: false, key: last10Digits, rawDigits, e164 }
 */
function parseIdentifier(input) {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed.includes("@")) {
    return {
      isEmail: true,
      key: trimmed.toLowerCase(),
      email: trimmed.toLowerCase(),
    };
  }

  const rawDigits = trimmed.replace(/\D/g, "");
  if (rawDigits.length < 10) return null;
  const last10 = rawDigits.slice(-10);
  const e164 = trimmed.startsWith("+")
    ? `+${rawDigits}`
    : rawDigits.length === 10
    ? `+91${rawDigits}`
    : `+${rawDigits}`;

  return {
    isEmail: false,
    key: last10,
    rawDigits,
    last10,
    e164,
  };
}

/**
 * POST /api/users/send-otp
 * Generates and delivers a 6-digit OTP code via WhatsApp and/or Email.
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { identifier } = req.body;
    const parsed = parseIdentifier(identifier);

    if (!parsed) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number or email address.",
      });
    }

    // Generate secure 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    let customer = null;
    const client = await pool.connect();
    try {
      if (parsed.isEmail) {
        const dbRes = await client.query(
          "SELECT * FROM customers WHERE LOWER(email) = $1 LIMIT 1",
          [parsed.email]
        );
        if (dbRes.rows.length > 0) customer = dbRes.rows[0];
      } else {
        const dbRes = await client.query(
          `SELECT * FROM customers 
           WHERE whatsapp_number = $1
              OR (LENGTH($2) >= 10 AND RIGHT(REGEXP_REPLACE(whatsapp_number, '[^0-9]', '', 'g'), 10) = $2)
           LIMIT 1`,
          [parsed.e164, parsed.last10]
        );
        if (dbRes.rows.length > 0) customer = dbRes.rows[0];
      }
    } finally {
      client.release();
    }

    // Store in OTP memory map
    const otpPayload = {
      otp: otpCode,
      expiresAt,
      customer,
      identifier: parsed.key,
      phone: parsed.isEmail ? (customer?.whatsapp_number || null) : parsed.e164,
      email: parsed.isEmail ? parsed.email : (customer?.email || null),
    };

    otpStore.set(parsed.key, otpPayload);
    if (parsed.last10) otpStore.set(parsed.last10, otpPayload);
    if (customer?.email) otpStore.set(customer.email.toLowerCase(), otpPayload);

    const deliveryPromises = [];
    const sentChannels = [];

    // 1. Deliver via Email if customer has an email address
    const targetEmail = parsed.isEmail ? parsed.email : customer?.email;
    if (targetEmail) {
      deliveryPromises.push(
        emailService
          .sendLoginOtpEmail(targetEmail, otpCode, customer?.full_name || "Customer")
          .then((r) => {
            if (r.success) sentChannels.push("Email");
          })
          .catch((err) => console.error("[send-otp] Email error:", err.message))
      );
    }

    // 2. Deliver via WhatsApp if customer has a phone number
    const targetPhone = !parsed.isEmail ? parsed.e164 : customer?.whatsapp_number;
    if (targetPhone) {
      deliveryPromises.push(
        sendWhatsAppOtp(targetPhone, otpCode)
          .then((r) => {
            if (r.success) sentChannels.push("WhatsApp");
          })
          .catch((err) => console.error("[send-otp] WhatsApp error:", err.message))
      );
    }

    // Await delivery attempts
    await Promise.all(deliveryPromises);

    const maskedDestination = targetEmail
      ? targetEmail.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + "*".repeat(b.length))
      : targetPhone ? targetPhone.slice(0, 4) + "******" + targetPhone.slice(-2) : "";

    const channelSummary = sentChannels.length > 0 ? sentChannels.join(" and ") : "WhatsApp / Email";

    return res.status(200).json({
      success: true,
      message: `Verification code sent to your ${channelSummary} (${maskedDestination})!`,
      channels: sentChannels,
      isExistingCustomer: !!customer,
      targetPhone: targetPhone || null,
      targetEmail: targetEmail || null,
    });
  } catch (error) {
    console.error("Error in /api/users/send-otp:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to send verification code. Please try again.",
    });
  }
});

/**
 * POST /api/users/verify-otp
 * Validates the 6-digit OTP code and signs the customer in.
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { identifier, otp, fullName, email } = req.body;
    const parsed = parseIdentifier(identifier);

    if (!parsed || !otp) {
      return res.status(400).json({
        success: false,
        message: "Identifier and 6-digit OTP are required.",
      });
    }

    // Lookup OTP entry
    const record = otpStore.get(parsed.key) || (parsed.last10 && otpStore.get(parsed.last10));

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No OTP found or code has expired. Please click 'Resend Code'.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(parsed.key);
      if (parsed.last10) otpStore.delete(parsed.last10);
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    if (record.otp.trim() !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect 6-digit code. Please check and try again.",
      });
    }

    // Correct OTP code! Clear from store
    otpStore.delete(parsed.key);
    if (parsed.last10) otpStore.delete(parsed.last10);
    if (record.email) otpStore.delete(record.email.toLowerCase());

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. If customer was already found during send-otp
      if (record.customer) {
        await client.query("COMMIT");
        return res.status(200).json({
          success: true,
          isNewUser: false,
          user: record.customer,
        });
      }

      // 2. Double check DB by phone / email
      let userRes = null;
      if (parsed.isEmail) {
        userRes = await client.query(
          "SELECT * FROM customers WHERE LOWER(email) = $1 LIMIT 1",
          [parsed.email]
        );
      } else {
        userRes = await client.query(
          `SELECT * FROM customers 
           WHERE whatsapp_number = $1
              OR (LENGTH($2) >= 10 AND RIGHT(REGEXP_REPLACE(whatsapp_number, '[^0-9]', '', 'g'), 10) = $2)
           LIMIT 1`,
          [parsed.e164, parsed.last10]
        );
      }

      if (userRes && userRes.rows.length > 0) {
        await client.query("COMMIT");
        return res.status(200).json({
          success: true,
          isNewUser: false,
          user: userRes.rows[0],
        });
      }

      // 3. New Customer registration
      const finalEmail = (email || (parsed.isEmail ? parsed.email : "")).trim().toLowerCase();
      const finalPhone = (parsed.isEmail ? (req.body.phone || "") : parsed.e164).trim();
      const finalName = (fullName || "").trim();

      if (!finalName || !finalEmail) {
        await client.query("ROLLBACK");
        return res.status(200).json({
          success: true,
          isNewUser: true,
          message: "Profile completion required.",
        });
      }

      // Check if email exists to link accounts
      const emailCheck = await client.query(
        "SELECT * FROM customers WHERE LOWER(email) = $1",
        [finalEmail]
      );

      if (emailCheck.rows.length > 0) {
        const updated = await client.query(
          `UPDATE customers 
           SET whatsapp_number = COALESCE(NULLIF($1, ''), whatsapp_number),
               full_name = COALESCE(NULLIF($2, ''), full_name)
           WHERE LOWER(email) = $3
           RETURNING *;`,
          [finalPhone, finalName, finalEmail]
        );
        await client.query("COMMIT");
        return res.status(200).json({
          success: true,
          isNewUser: false,
          user: updated.rows[0],
        });
      }

      const inserted = await client.query(
        `INSERT INTO customers (full_name, email, whatsapp_number)
         VALUES ($1, $2, $3) RETURNING *;`,
        [finalName, finalEmail, finalPhone]
      );

      await client.query("COMMIT");
      return res.status(201).json({
        success: true,
        isNewUser: false,
        user: inserted.rows[0],
      });
    } catch (dbErr) {
      await client.query("ROLLBACK");
      throw dbErr;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error in /api/users/verify-otp:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error during verification.",
    });
  }
});

// Fetch orders for a given phone number or email
router.get("/:phone/orders", async (req, res) => {
  try {
    const { phone } = req.params;
    const isEmail = phone.includes("@");
    const rawDigits = String(phone).replace(/\D/g, "");
    const last10 = rawDigits.slice(-10);

    const client = await pool.connect();

    try {
      let result;
      if (isEmail) {
        result = await client.query(
          `SELECT o.id, o.requirements, o.amount, o.status as order_status, o.created_at, 
                  s.service_name, s.icon,
                  p.verification_status, p.razorpay_payment_id
           FROM orders o
           JOIN customers c ON o.customer_id = c.id
           LEFT JOIN services s ON o.service_id = s.id
           LEFT JOIN razorpay_orders ro ON o.id = ro.order_id
           LEFT JOIN payments p ON ro.razorpay_order_id = p.razorpay_order_id
           WHERE LOWER(c.email) = $1
           ORDER BY o.created_at DESC`,
          [phone.trim().toLowerCase()]
        );
      } else {
        result = await client.query(
          `SELECT o.id, o.requirements, o.amount, o.status as order_status, o.created_at, 
                  s.service_name, s.icon,
                  p.verification_status, p.razorpay_payment_id
           FROM orders o
           JOIN customers c ON o.customer_id = c.id
           LEFT JOIN services s ON o.service_id = s.id
           LEFT JOIN razorpay_orders ro ON o.id = ro.order_id
           LEFT JOIN payments p ON ro.razorpay_order_id = p.razorpay_order_id
           WHERE c.whatsapp_number = $1
              OR (LENGTH($2) >= 10 AND RIGHT(REGEXP_REPLACE(c.whatsapp_number, '[^0-9]', '', 'g'), 10) = $2)
           ORDER BY o.created_at DESC`,
          [phone, last10]
        );
      }

      res.status(200).json({ success: true, orders: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
});

// Backward-compatible direct login route
router.post("/login", async (req, res) => {
  try {
    const { phone, fullName, email } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number required" });
    }

    const rawDigits = String(phone).replace(/\D/g, "");
    const last10 = rawDigits.slice(-10);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      let userRes = await client.query(
        `SELECT * FROM customers 
         WHERE whatsapp_number = $1
            OR (LENGTH($2) >= 10 AND RIGHT(REGEXP_REPLACE(whatsapp_number, '[^0-9]', '', 'g'), 10) = $2)
         LIMIT 1;`,
        [phone, last10]
      );

      if (userRes.rows.length > 0) {
        await client.query("COMMIT");
        return res.status(200).json({ success: true, isNewUser: false, user: userRes.rows[0] });
      } else {
        if (!fullName || !email) {
          await client.query("ROLLBACK");
          return res.status(200).json({ success: true, isNewUser: true, message: "Profile completion required" });
        }

        const emailCheck = await client.query("SELECT * FROM customers WHERE email = $1", [String(email).trim()]);
        if (emailCheck.rows.length > 0) {
          const updatedUser = await client.query(
            `UPDATE customers 
             SET whatsapp_number = $1,
                 full_name = COALESCE(NULLIF($2, ''), full_name)
             WHERE email = $3
             RETURNING *;`,
            [phone, fullName ? String(fullName).trim() : null, String(email).trim()]
          );

          await client.query("COMMIT");
          return res.status(200).json({ success: true, isNewUser: false, user: updatedUser.rows[0] });
        }

        const newUser = await client.query(
          `INSERT INTO customers (full_name, email, whatsapp_number)
           VALUES ($1, $2, $3) RETURNING *`,
          [String(fullName).trim(), String(email).trim(), phone]
        );

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
    res.status(500).json({ success: false, message: error?.message || "Internal server error" });
  }
});

module.exports = router;
