const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const isConfigured = Boolean(keyId && keySecret);
const isTestMode = Boolean(keyId && keyId.startsWith("rzp_test_"));

// Startup validation logger
if (!isConfigured) {
  console.warn("⚠️ WARNING: Razorpay Key ID or Key Secret is missing in environment variables.");
} else if (!isTestMode) {
  console.warn("⚠️ WARNING: Razorpay Key ID does NOT start with 'rzp_test_'. Ensure you are using TEST MODE.");
} else {
  console.log("✅ Razorpay TEST MODE SDK initialized successfully.");
}

// Instantiate Razorpay SDK client
const razorpayInstance = new Razorpay({
  key_id: keyId || "dummy_key_id",
  key_secret: keySecret || "dummy_key_secret",
});

/**
 * Returns safe public status of Razorpay configuration.
 * NEVER exposes keySecret.
 */
const getRazorpayStatus = () => {
  return {
    success: true,
    razorpayConfigured: isConfigured,
    mode: isTestMode ? "test" : isConfigured ? "live" : "unconfigured",
    keyIdConfigured: Boolean(keyId),
  };
};

module.exports = {
  razorpayInstance,
  isConfigured,
  isTestMode,
  getRazorpayStatus,
};
