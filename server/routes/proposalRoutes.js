const express = require("express");
const router = express.Router();
const {
  getProposalBySlug,
  createProposalDepositOrder,
  verifyProposalDepositPayment,
} = require("../controllers/proposalController");

// Public endpoints to view and authorize proposals
router.get("/:slug", getProposalBySlug);
router.post("/:slug/deposit-order", createProposalDepositOrder);
router.post("/:slug/verify-deposit", verifyProposalDepositPayment);

module.exports = router;
