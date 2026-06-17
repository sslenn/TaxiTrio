const https = require('https');

/**
 * Sends a formatted alert message to the Admin's Telegram channel or chat.
 * @param {string} message - HTML-formatted string message.
 */
function sendTelegramAlert(message, replyMarkup = null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // If token or chat id are missing, fail silently to avoid crashing the server
  if (!token || !chatId) {
    console.warn('Telegram Alert skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env');
    return;
  }

  const payloadData = {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };

  if (replyMarkup) {
    payloadData.reply_markup = replyMarkup;
  }

  const payload = JSON.stringify(payloadData);

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      if (res.statusCode !== 200) {
        console.error('Telegram API responded with error status:', res.statusCode, responseData);
      }
    });
  });

  req.on('error', (err) => {
    console.error('Network error occurred sending Telegram alert:', err.message);
  });

  req.write(payload);
  req.end();
}

/**
 * Automatically registers the webhook URL with Telegram if APP_URL is a public HTTPS URL.
 */
function initializeTelegramWebhook() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.APP_URL;

  if (!token || !appUrl) {
    console.warn('Telegram Webhook Setup skipped: TELEGRAM_BOT_TOKEN or APP_URL is missing in .env');
    return;
  }

  if (appUrl.includes('localhost')) {
    console.warn('⚠️ Telegram Webhook Setup skipped: APP_URL is set to localhost. Telegram cannot send webhook callback queries to localhost. To test Telegram actions, use a tool like ngrok and set APP_URL to your public HTTPS url.');
    return;
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`;
  const payload = JSON.stringify({ url: webhookUrl });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/setWebhook`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`✅ Telegram Webhook registered successfully to: ${webhookUrl}`);
      } else {
        console.error('❌ Failed to register Telegram Webhook:', res.statusCode, responseData);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error setting Telegram webhook:', err.message);
  });

  req.write(payload);
  req.end();
}

module.exports = { sendTelegramAlert, initializeTelegramWebhook };
