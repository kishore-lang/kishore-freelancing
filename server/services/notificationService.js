/**
 * WhatsApp Payment Notification Backend Service.
 * 
 * Supports two provider modes:
 *   WHATSAPP_PROVIDER=mock   → Console log only (no real messages)
 *   WHATSAPP_PROVIDER=meta   → Meta WhatsApp Cloud API (real messages)
 * 
 * All WhatsApp credentials remain exclusively in server/.env.
 * This module NEVER exposes tokens, secrets, or credentials.
 */

/**
 * Normalize a WhatsApp phone number to international digits-only format.
 * 
 * Rules:
 *   - Strips all non-digit characters (+, spaces, dashes, parentheses).
 *   - If the result is exactly 10 digits (Indian local number), prepends "91".
 *   - If the result already includes a country code (e.g., "919876543210"), returns as-is.
 *   - Supports international numbers that already have a country code.
 * 
 * @param {string} phoneNumber - Raw phone number from the customer.
 * @returns {string} Digits-only international format (e.g., "919876543210").
 */
const normalizeWhatsAppNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") return "";

  // Strip everything except digits
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // Indian 10-digit local number → prepend country code 91
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }

  // Already has country code or is an international number
  return digitsOnly;
};

/**
 * Send a WhatsApp message via Meta WhatsApp Cloud API.
 * 
 * Endpoint: POST https://graph.facebook.com/{API_VERSION}/{PHONE_NUMBER_ID}/messages
 * Auth: Bearer {WHATSAPP_ACCESS_TOKEN}
 * 
 * Uses a template message ("payment_success") with parameters.
 * If the template is not yet approved, falls back to a plain text message.
 * 
 * @param {Object} paymentData - Payment details for the message.
 * @returns {Object} Result with success status and Meta API response info.
 */
const sendMetaWhatsAppMessage = async (paymentData) => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v26.0";

  // Validate required configuration
  if (!accessToken) {
    console.error("[META WHATSAPP] WHATSAPP_ACCESS_TOKEN is not configured.");
    return { success: false, notificationStatus: "failed", error: "Missing WhatsApp access token configuration." };
  }
  if (!phoneNumberId) {
    console.error("[META WHATSAPP] WHATSAPP_PHONE_NUMBER_ID is not configured.");
    return { success: false, notificationStatus: "failed", error: "Missing WhatsApp phone number ID configuration." };
  }

  const {
    customerName = "Customer",
    whatsappNumber = "",
    serviceName = "Freelance Service",
    amount = 0,
    orderId = "N/A",
    paymentId = "N/A",
  } = paymentData;

  // Normalize the customer's WhatsApp number
  const normalizedNumber = normalizeWhatsAppNumber(whatsappNumber);
  if (!normalizedNumber || normalizedNumber.length < 10) {
    console.error("[META WHATSAPP] Invalid recipient WhatsApp number after normalization.");
    return { success: false, notificationStatus: "failed", error: "Invalid recipient WhatsApp number." };
  }

  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  // Use a plain text message for maximum compatibility.
  // Template messages require pre-approval in Meta Business Manager.
  // Once a template named "payment_success" is approved, switch to template mode.
  const messageBody = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalizedNumber,
    type: "text",
    text: {
      preview_url: false,
      body: `✅ Payment Successful\n\nHi ${customerName},\n\nYour payment of ₹${amount} for ${serviceName} has been successfully received.\n\nOrder ID: ${orderId}\n\nThank you for choosing Kishore Freelance Services.`,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(messageBody),
      signal: AbortSignal.timeout(15000), // 15-second timeout
    });

    const responseData = await response.json();

    if (response.ok && responseData.messages && responseData.messages.length > 0) {
      const messageId = responseData.messages[0].id;
      console.log(`[META WHATSAPP] Message sent successfully. Message ID: ${messageId ? messageId.substring(0, 12) + "..." : "N/A"}`);
      console.log(`[META WHATSAPP] Recipient: ${normalizedNumber.substring(0, 4)}****${normalizedNumber.slice(-2)}`);
      console.log(`[META WHATSAPP] Service: ${serviceName} | Amount: ₹${amount}`);
      return {
        success: true,
        provider: "meta",
        notificationStatus: "sent",
        messageId: messageId,
      };
    } else {
      // Meta API returned an error response
      const errorMsg = responseData.error?.message || "Unknown Meta API error";
      const errorCode = responseData.error?.code || response.status;
      console.error(`[META WHATSAPP] API Error (${errorCode}): ${errorMsg}`);
      // Do NOT log the access token or any credential
      return {
        success: false,
        provider: "meta",
        notificationStatus: "failed",
        error: `Meta API error (${errorCode}): ${errorMsg}`,
      };
    }
  } catch (networkError) {
    // Handle network timeouts, DNS failures, etc.
    const errMsg = networkError?.message || "Network request failed";
    console.error(`[META WHATSAPP] Network Error: ${errMsg}`);
    return {
      success: false,
      provider: "meta",
      notificationStatus: "failed",
      error: `Network error: ${errMsg}`,
    };
  }
};

/**
 * Main entry point for sending payment success notifications.
 * Routes to the appropriate provider based on WHATSAPP_PROVIDER env var.
 * 
 * @param {Object} paymentData - Contains customerName, whatsappNumber, serviceName, amount, orderId, paymentId.
 * @returns {Object} Result with success/failure status.
 */
const sendPaymentSuccessNotification = async (paymentData) => {
  try {
    const provider = (process.env.WHATSAPP_PROVIDER || "mock").toLowerCase();

    const {
      customerName = "Customer",
      whatsappNumber = "N/A",
      serviceName = "Freelance Service",
      amount = 0,
      orderId = "N/A",
      paymentId = "N/A",
    } = paymentData;

    if (provider === "mock") {
      console.log(`=======================================================`);
      console.log(`[WHATSAPP MOCK NOTIFICATION] Payment Verification Success`);
      console.log(`Provider Mode : MOCK (No real messages sent)`);
      console.log(`Customer      : ${customerName}`);
      console.log(`WhatsApp No   : ${whatsappNumber}`);
      console.log(`Service       : ${serviceName}`);
      console.log(`Amount        : ₹${amount}`);
      console.log(`Order ID      : ${orderId}`);
      console.log(`Payment ID    : ${paymentId}`);
      console.log(`Status        : MOCK NOTIFICATION GENERATED`);
      console.log(`=======================================================`);

      return {
        success: true,
        provider: "mock",
        notificationStatus: "sent",
        message: "Mock notification generated successfully.",
      };
    }

    if (provider === "meta") {
      return await sendMetaWhatsAppMessage(paymentData);
    }

    // Unknown provider - log warning and return failure
    console.warn(`[WHATSAPP] Unknown provider '${provider}'. No notification sent.`);
    return {
      success: false,
      provider: provider,
      notificationStatus: "failed",
      error: `Unknown WhatsApp provider: ${provider}`,
    };
  } catch (error) {
    console.error("Failed to process WhatsApp notification:", error?.message || error);
    // Return failure result so backend updates notification_status = 'failed' without breaking payment verification
    return {
      success: false,
      notificationStatus: "failed",
      error: error?.message || "Notification failed.",
    };
  }
};

/**
 * Validate Meta WhatsApp configuration at startup.
 * Logs configuration status without exposing credential values.
 * 
 * @returns {Object} Configuration status.
 */
const getWhatsAppStatus = () => {
  const provider = (process.env.WHATSAPP_PROVIDER || "mock").toLowerCase();
  const status = {
    provider: provider,
    configured: false,
  };

  if (provider === "mock") {
    status.configured = true;
    status.mode = "mock";
  } else if (provider === "meta") {
    const hasToken = !!process.env.WHATSAPP_ACCESS_TOKEN;
    const hasPhoneId = !!process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v26.0";

    status.configured = hasToken && hasPhoneId;
    status.mode = "meta";
    status.apiVersion = apiVersion;
    status.accessTokenConfigured = hasToken;
    status.phoneNumberIdConfigured = hasPhoneId;
  }

  return status;
};

module.exports = {
  sendPaymentSuccessNotification,
  getWhatsAppStatus,
  normalizeWhatsAppNumber,
};
