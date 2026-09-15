const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

/**
 * Appends a new row to the specified Google Sheet.
 * @param {Object} orderData 
 */
const appendOrderToSheet = async (orderData) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      console.warn("[Google Sheets] Missing credentials. Skipping sheet logging.");
      return { success: false, message: "Missing credentials" };
    }

    // Handle newline characters in private key when loaded from .env
    privateKey = privateKey.replace(/\\n/g, '\n');

    // Authenticate with the Service Account using JWT
    const serviceAccountAuth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

    // Load document properties and worksheets
    await doc.loadInfo(); 
    
    // Get the first sheet
    const sheet = doc.sheetsByIndex[0]; 

    // Set the headers if they don't exist yet
    try {
      await sheet.setHeaderRow(['Date', 'Order ID', 'Payment ID', 'Customer Name', 'Email', 'WhatsApp Number', 'Service Name', 'Amount (INR)']);
    } catch (e) {
      // Headers might already exist, which is fine
    }

    const {
      customerName = "N/A",
      customerEmail = "N/A",
      whatsappNumber = "N/A",
      serviceName = "N/A",
      amount = 0,
      orderId = "N/A",
      paymentId = "N/A",
    } = orderData;

    // Append the row
    await sheet.addRow({
      'Date': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Order ID': orderId,
      'Payment ID': paymentId,
      'Customer Name': customerName,
      'Email': customerEmail,
      'WhatsApp Number': whatsappNumber,
      'Service Name': serviceName,
      'Amount (INR)': amount,
    });

    console.log(`[Google Sheets] Successfully appended order ${orderId}`);
    return { success: true };

  } catch (error) {
    console.error("[Google Sheets] Error appending to sheet:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  appendOrderToSheet
};
