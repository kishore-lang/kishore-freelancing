const { Resend } = require('resend');

/**
 * Service for sending transactional emails via Resend.
 */
class EmailService {
  constructor() {
    this.defaultFrom = process.env.RESEND_FROM_EMAIL 
      ? (process.env.RESEND_FROM_EMAIL.includes('<') ? process.env.RESEND_FROM_EMAIL : `K Freelance <${process.env.RESEND_FROM_EMAIL}>`)
      : 'K Freelance <kfreelance@kfreelance.online>'; 
  }

  getResend() {
    if (!this._resend && process.env.RESEND_API_KEY) {
      this._resend = new Resend(process.env.RESEND_API_KEY);
    }
    return this._resend;
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
      const resendClient = this.getResend();
      if (!resendClient) {
        return { success: false, error: 'Resend client unavailable' };
      }
      const { data, error } = await resendClient.emails.send({
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

  /**
   * Sends a 6-digit login verification OTP email to the customer.
   * 
   * @param {string} toEmail - Customer email address.
   * @param {string} otpCode - 6-digit verification code.
   * @param {string} customerName - Name of the customer.
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async sendLoginOtpEmail(toEmail, otpCode, customerName = "Customer") {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[EmailService] RESEND_API_KEY is missing. OTP email skipped.');
      return { success: false, error: 'Missing API Key' };
    }

    if (!toEmail) {
      return { success: false, error: 'Customer email is missing.' };
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #000000; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">K FREELANCING</h1>
          <p style="color: #dc2626; margin: 4px 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Client Portal Security</p>
        </div>
        <div style="padding: 32px 28px;">
          <h2 style="color: #09090b; font-size: 18px; margin-top: 0; font-weight: 700;">Your Login Verification Code</h2>
          <p style="color: #52525b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Hi ${customerName},<br>Use the 6-digit code below to log in to your K Freelancing Client Portal.
          </p>
          
          <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 18px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #000000; font-family: monospace;">${otpCode}</span>
          </div>

          <p style="color: #71717a; font-size: 13px; line-height: 1.5; margin: 0;">
            This code will expire in <strong>10 minutes</strong>. If you did not request this login, you can safely ignore this email.
          </p>
        </div>
        <div style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 16px; text-align: center; font-size: 11px; color: #a1a1aa;">
          © ${new Date().getFullYear()} K Freelancing • Professional Web Development
        </div>
      </div>
    `;

    try {
      const resendClient = this.getResend();
      if (!resendClient) {
        return { success: false, error: 'Resend client unavailable' };
      }
      const { data, error } = await resendClient.emails.send({
        from: this.defaultFrom,
        to: [toEmail],
        subject: `${otpCode} is your K Freelancing login code`,
        html: htmlContent,
      });

      if (error) {
        console.error('[EmailService] Error sending OTP email:', error);
        return { success: false, error: error.message };
      }

      console.log(`[EmailService] Login OTP email sent to ${toEmail}. ID: ${data?.id}`);
      return { success: true, data };
    } catch (err) {
      console.error('[EmailService] Exception during OTP email dispatch:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Sends a personalized welcome email to newly registered users/students.
   * 
   * @param {string} toEmail - Customer email address.
   * @param {string} customerName - Name of the customer.
   * @param {string} course - Course or service of interest.
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async sendWelcomeEmail(toEmail, customerName = "Member", course = "Web & Tech Services") {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[EmailService] RESEND_API_KEY is missing. Welcome email skipped.');
      return { success: false, error: 'Missing API Key' };
    }

    if (!toEmail) {
      return { success: false, error: 'Customer email is missing.' };
    }

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #000000; padding: 28px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">K FREELANCING</h1>
          <p style="color: #ef4444; margin: 6px 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Client & Student Portal</p>
        </div>
        <div style="padding: 36px 30px;">
          <h2 style="color: #09090b; font-size: 22px; margin-top: 0; font-weight: 800;">Welcome to K Freelancing, ${customerName}! 🎉</h2>
          <p style="color: #52525b; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with your phone number. Your client account has been activated successfully!
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 10px; font-size: 13px; font-weight: bold; text-transform: uppercase; color: #64748b;">Selected Area of Interest</p>
            <p style="margin: 0; font-size: 17px; font-weight: 700; color: #0f172a;">${course}</p>
          </div>

          <h3 style="color: #1e293b; font-size: 16px; margin: 24px 0 12px; font-weight: 700;">What you can do next:</h3>
          <ul style="color: #475569; font-size: 14px; line-height: 1.7; padding-left: 20px; margin: 0 0 24px;">
            <li><strong>Access Your Dashboard:</strong> Log in anytime via OTP to view orders, deliverables, and timeline milestones.</li>
            <li><strong>Invoices & Receipts:</strong> Download GST and tax-compliant PDF invoices whenever payments are completed.</li>
            <li><strong>Direct Tech Support:</strong> Chat directly via WhatsApp or phone with founder Kishore J (+91 7904001962).</li>
          </ul>

          <div style="text-align: center; margin: 30px 0 20px;">
            <a href="https://kfreelance.online/dashboard" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 32px; font-weight: 700; text-decoration: none; border-radius: 4px; font-size: 15px;">
              Open My Dashboard →
            </a>
          </div>

          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
            Warm regards,<br>
            <strong style="color: #0f172a;">Kishore J</strong><br>
            Founder & Lead Engineer, K Freelancing<br>
            <a href="mailto:kfreelance@kfreelance.online" style="color: #dc2626; text-decoration: none;">kfreelance@kfreelance.online</a>
          </p>
        </div>
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px; text-align: center; font-size: 12px; color: #94a3b8;">
          © ${new Date().getFullYear()} K Freelancing • Professional Web Architecture & Production
        </div>
      </div>
    `;

    try {
      const resendClient = this.getResend();
      if (!resendClient) {
        return { success: false, error: 'Resend client unavailable' };
      }
      const { data, error } = await resendClient.emails.send({
        from: this.defaultFrom,
        to: [toEmail],
        subject: `Welcome to K Freelancing, ${customerName}! Your portal is ready 🚀`,
        html: htmlContent,
      });

      if (error) {
        console.error('[EmailService] Error sending Welcome email:', error);
        return { success: false, error: error.message };
      }

      console.log(`[EmailService] Welcome email sent to ${toEmail}. ID: ${data?.id}`);
      return { success: true, data };
    } catch (err) {
      console.error('[EmailService] Exception during welcome email dispatch:', err.message);
      return { success: false, error: err.message };
    }
  }
}

// Export a singleton instance
module.exports = new EmailService();
