const { pool } = require("../config/database");
const { razorpayInstance } = require("../config/razorpay");
const crypto = require("crypto");

// In-memory fallback for local dev when PostgreSQL is offline
const memoryProposals = [];

/**
 * Generate a URL-friendly slug from company name
 */
function generateSlug(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base || "client"}-${randomSuffix}`;
}

/**
 * Create a new proposal (Admin)
 * POST /api/admin/proposals
 */
const createProposal = async (req, res) => {
  try {
    const {
      client_name,
      client_email,
      client_phone,
      project_title,
      summary,
      services,
      deliverables,
      milestones,
      total_amount,
      deposit_percentage = 50,
      deposit_amount,
    } = req.body;

    if (!client_name || !project_title) {
      return res.status(400).json({
        success: false,
        message: "Client name and project title are required",
      });
    }

    const slug = generateSlug(client_name);
    const finalTotal = Number(total_amount) || 0;
    const finalDeposit = Number(deposit_amount) || Math.round((finalTotal * Number(deposit_percentage)) / 100);

    const proposalObj = {
      slug,
      client_name: client_name.trim(),
      client_email: client_email ? client_email.trim() : null,
      client_phone: client_phone ? client_phone.trim() : null,
      project_title: project_title.trim(),
      summary: summary || "",
      services: services || [],
      deliverables: deliverables || [],
      milestones: milestones || [],
      total_amount: finalTotal,
      deposit_percentage: Number(deposit_percentage) || 50,
      deposit_amount: finalDeposit,
      currency: "INR",
      status: "sent",
      created_at: new Date().toISOString(),
    };

    // Try PostgreSQL
    try {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS proposals (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            client_name VARCHAR(255) NOT NULL,
            client_email VARCHAR(255),
            client_phone VARCHAR(50),
            project_title VARCHAR(255) NOT NULL,
            summary TEXT,
            services JSONB NOT NULL DEFAULT '[]',
            deliverables JSONB NOT NULL DEFAULT '[]',
            milestones JSONB NOT NULL DEFAULT '[]',
            total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
            deposit_percentage INTEGER DEFAULT 50,
            deposit_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
            currency VARCHAR(10) DEFAULT 'INR',
            status VARCHAR(50) DEFAULT 'sent',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        const result = await client.query(`
          INSERT INTO proposals (
            slug, client_name, client_email, client_phone, project_title,
            summary, services, deliverables, milestones, total_amount,
            deposit_percentage, deposit_amount, currency, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING *
        `, [
          proposalObj.slug,
          proposalObj.client_name,
          proposalObj.client_email,
          proposalObj.client_phone,
          proposalObj.project_title,
          proposalObj.summary,
          JSON.stringify(proposalObj.services),
          JSON.stringify(proposalObj.deliverables),
          JSON.stringify(proposalObj.milestones),
          proposalObj.total_amount,
          proposalObj.deposit_percentage,
          proposalObj.deposit_amount,
          proposalObj.currency,
          proposalObj.status,
        ]);

        const saved = result.rows[0];
        memoryProposals.unshift(saved);
        return res.status(201).json({
          success: true,
          message: "Proposal created successfully",
          proposal: saved,
        });
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn("[Proposals] Database fallback to memory store:", dbErr.message);
      const fallbackProposal = { id: Date.now(), ...proposalObj };
      memoryProposals.unshift(fallbackProposal);
      return res.status(201).json({
        success: true,
        message: "Proposal created successfully (in-memory mode)",
        proposal: fallbackProposal,
      });
    }
  } catch (error) {
    console.error("Error creating proposal:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all proposals for Admin
 * GET /api/admin/proposals
 */
const getAdminProposals = async (req, res) => {
  try {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT * FROM proposals ORDER BY created_at DESC LIMIT 50;
        `);
        return res.status(200).json({
          success: true,
          proposals: result.rows,
        });
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn("[Proposals] Database fallback to memory store:", dbErr.message);
      return res.status(200).json({
        success: true,
        proposals: memoryProposals,
      });
    }
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete a proposal (Admin)
 * DELETE /api/admin/proposals/:id
 */
const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const client = await pool.connect();
      try {
        await client.query("DELETE FROM proposals WHERE id = $1 OR slug = $1", [id]);
        return res.status(200).json({ success: true, message: "Proposal deleted" });
      } finally {
        client.release();
      }
    } catch (dbErr) {
      const idx = memoryProposals.findIndex((p) => String(p.id) === String(id) || p.slug === id);
      if (idx !== -1) memoryProposals.splice(idx, 1);
      return res.status(200).json({ success: true, message: "Proposal deleted from memory" });
    }
  } catch (error) {
    console.error("Error deleting proposal:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Public: Get proposal by slug
 * GET /api/proposals/:slug
 */
const getProposalBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(
          "SELECT * FROM proposals WHERE slug = $1 LIMIT 1",
          [slug]
        );
        if (result.rows.length > 0) {
          return res.status(200).json({
            success: true,
            proposal: result.rows[0],
          });
        }
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn("[Proposals] Database fetch failed, checking memory:", dbErr.message);
    }

    // Check memory store
    const mem = memoryProposals.find((p) => p.slug === slug);
    if (mem) {
      return res.status(200).json({ success: true, proposal: mem });
    }

    return res.status(404).json({ success: false, message: "Proposal not found" });
  } catch (error) {
    console.error("Error fetching proposal by slug:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Public: Create Razorpay deposit order for proposal
 * POST /api/proposals/:slug/deposit-order
 */
const createProposalDepositOrder = async (req, res) => {
  try {
    const { slug } = req.params;
    let proposal = null;

    try {
      const client = await pool.connect();
      try {
        const result = await client.query("SELECT * FROM proposals WHERE slug = $1 LIMIT 1", [slug]);
        if (result.rows.length > 0) proposal = result.rows[0];
      } finally {
        client.release();
      }
    } catch (dbErr) {
      proposal = memoryProposals.find((p) => p.slug === slug);
    }

    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    const depositAmount = Number(proposal.deposit_amount);
    const amountInPaise = Math.round(depositAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `prop_${slug.substring(0, 10)}_${Date.now()}`.substring(0, 40),
      notes: {
        proposal_slug: slug,
        client_name: proposal.client_name,
        project_title: proposal.project_title,
      },
    };

    let orderData;
    try {
      orderData = await razorpayInstance.orders.create(options);
    } catch (rzpErr) {
      console.warn("[Razorpay] Using test mock order for proposal deposit:", rzpErr.message);
      orderData = {
        id: `order_prop_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
      };
    }

    return res.status(200).json({
      success: true,
      order: orderData,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
      depositAmount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Error creating proposal deposit order:", error);
    res.status(500).json({ success: false, message: "Unable to create deposit order" });
  }
};

/**
 * Public: Verify Razorpay deposit payment for proposal
 * POST /api/proposals/:slug/verify-deposit
 */
const verifyProposalDepositPayment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature if secret available
    if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== "placeholder_secret") {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
      }
    }

    // Update proposal status in DB
    try {
      const client = await pool.connect();
      try {
        await client.query(
          "UPDATE proposals SET status = 'deposit_paid' WHERE slug = $1",
          [slug]
        );
      } finally {
        client.release();
      }
    } catch (dbErr) {
      const mem = memoryProposals.find((p) => p.slug === slug);
      if (mem) mem.status = "deposit_paid";
    }

    return res.status(200).json({
      success: true,
      message: "Advance deposit authorized successfully! Project confirmed.",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error verifying proposal deposit:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createProposal,
  getAdminProposals,
  deleteProposal,
  getProposalBySlug,
  createProposalDepositOrder,
  verifyProposalDepositPayment,
};
