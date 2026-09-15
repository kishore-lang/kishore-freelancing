const { Resend } = require('resend');

/**
 * Service for sending transactional emails via Resend.
 */
class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    // Updated to use the newly purchased domain
    this.defaultFrom = 'hello@kfreelance.online'; 
  }

  /**
   * Sends an order confirmation email to the customer.
   * 
   * @param {Object} orderData - The order details.
   * @param {string} orderData.customerName - Name of the customer.
   * @param {string} orderData.customerEmail - Email address of the customer.
   * @param {string} orderData.orderId - Razorpay Order ID.
   * @param {string} orderData.serviceName - Name of the service purchased.
   * @param {number} orderData.amount - Total amount paid (in INR).
   * @returns {Object} Result of the email dispatch with success flag.
   */
  async sendOrderConfirmationEmail(orderData) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[EmailService] RESEND_API_KEY is missing. Email skipped.');
      return { success: false, error: 'Missing API Key' };
    }

    const {
      customerName,
      customerEmail,
      orderId,
      serviceName,
      amount
    } = orderData;

    if (!customerEmail) {
      console.error('[EmailService] Customer email is missing. Cannot send confirmation.');
      return { success: false, error: 'Missing Customer Email' };
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #030712; padding: 20px; text-align: center;">
          <h1 style="color: #00f0ff; margin: 0;">K Freelancing</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Payment Successful!</h2>
          <p style="color: #555; line-height: 1.5;">Hi ${customerName},</p>
          <p style="color: #555; line-height: 1.5;">Thank you for your order. We have successfully received your payment for the following service:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f9f9f9; border-radius: 6px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eaeaea; font-weight: bold; color: #555;">Order ID:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eaeaea; color: #333;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eaeaea; font-weight: bold; color: #555;">Service:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eaeaea; color: #333;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #555;">Amount Paid:</td>
              <td style="padding: 12px; color: #333;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-top: 1px solid #eaeaea; font-weight: bold; color: #555;">Payment Status:</td>
              <td style="padding: 12px; border-top: 1px solid #eaeaea; color: #059669; font-weight: bold;">Paid / Verified</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-top: 1px solid #eaeaea; font-weight: bold; color: #555;">Date:</td>
              <td style="padding: 12px; border-top: 1px solid #eaeaea; color: #333;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>

          <p style="color: #555; line-height: 1.5;">We will begin working on your project shortly. If you have any questions, feel free to reply to this email.</p>
          <p style="color: #555; line-height: 1.5; margin-bottom: 0;">Best regards,<br><strong>Kishore J</strong><br>Founder, K Freelancing</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          © ${new Date().getFullYear()} K Freelancing. All rights reserved.
        </div>
      </div>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.defaultFrom,
        to: [customerEmail],
        subject: `Payment Successful - Order Confirmation #${orderId}`,
        html: htmlContent,
      });

      if (error) {
        console.error('[EmailService] Error sending email via Resend:', error);
        return { success: false, error: error.message };
      }

      console.log(`[EmailService] Order confirmation email sent to ${customerEmail}. ID: ${data?.id}`);
      return { success: true, data };

    } catch (err) {
      console.error('[EmailService] Exception during email dispatch:', err.message);
      // Ensure failure never crashes the main thread
      return { success: false, error: err.message };
    }
  }
}

// Export a singleton instance
module.exports = new EmailService();
