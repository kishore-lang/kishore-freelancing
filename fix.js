const fs = require('fs');
const text = "const sendTelegramAlert = async (message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('[Telegram] Credentials missing. Skipping alert.');
    return;
  }

  const url = 'https://api.telegram.org/bot' + token + '/sendMessage';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('[Telegram] Error response from API:', await response.text());
    } else {
      console.log('[Telegram] Alert sent successfully!');
    }
  } catch (error) {
    console.error('[Telegram] Request failed:', error);
  }
};

module.exports = { sendTelegramAlert };"

fs.writeFileSync('server/services/telegramService.js', text, 'utf8');
