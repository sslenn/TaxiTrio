const customTripService = require('../services/customTrip_service');
const { CustomTripRequest, Notification, User } = require('../../models');
const https = require('https');

// Helper function to send requests to Telegram API
const sendTelegramRequest = (method, payloadData) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn(`Telegram API error: Token is missing for method ${method}`);
    return;
  }

  const payload = JSON.stringify(payloadData);
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/${method}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    let resData = '';
    res.on('data', (chunk) => resData += chunk);
    res.on('end', () => {
      if (res.statusCode !== 200) {
        console.error(`Telegram Method ${method} failed:`, res.statusCode, resData);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`Network error on Telegram ${method}:`, err.message);
  });

  req.write(payload);
  req.end();
};

const handleWebhook = async (req, res) => {
  try {
    const { callback_query, message } = req.body;

    // 1. Handle Inline Button Clicks (Callback Queries)
    if (callback_query) {
      const { data, message: callbackMsg, id: callback_query_id } = callback_query;
      const [action, tripId] = data.split(':');

      if (action === 'reject_trip') {
        try {
          // Reject custom trip using standard service
          await customTripService.updateStatus(tripId, 'rejected', 'Rejected via Telegram Admin Button');

          // Answer callback query with success pop-up
          sendTelegramRequest('answerCallbackQuery', {
            callback_query_id: callback_query_id,
            text: 'Trip request has been rejected!'
          });

          // Update original alert message text to remove inline buttons
          const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
          sendTelegramRequest('editMessageText', {
            chat_id: callbackMsg.chat.id,
            message_id: callbackMsg.message_id,
            text: callbackMsg.text + `\n\n<b>Processed:</b> REJECTED (via Telegram Admin)\n📅 <i>Processed At: ${formattedTimestamp}</i>`,
            parse_mode: 'HTML'
          });
        } catch (dbErr) {
          console.error('Database rejection update failed via Telegram webhook:', dbErr);
          sendTelegramRequest('answerCallbackQuery', {
            callback_query_id: callback_query_id,
            text: `Error rejecting: ${dbErr.message || 'database error'}`
          });
        }
      }

      if (action === 'approve_trip') {
        // Answer callback query to stop loading state in Telegram client
        sendTelegramRequest('answerCallbackQuery', {
          callback_query_id: callback_query_id,
          text: 'Prompting price...'
        });

        // Send a force-reply message to allow the admin to type the price directly
        sendTelegramRequest('sendMessage', {
          chat_id: callbackMsg.chat.id,
          text: `💰 <b>Quote Price for Request ID: #${tripId}</b> (Ref: ${callbackMsg.message_id})\nReply to this message with just the price number (e.g. 50 or $50) followed by any note.`,
          parse_mode: 'HTML',
          reply_markup: {
            force_reply: true,
            selective: true
          }
        });
      }
    }

    // 2. Handle Text Replies (Quoting Price or Sending Custom Message)
    if (message) {
      const { text, reply_to_message } = message;
      console.log(`[Telegram Webhook] Received text: "${text}"`);
      if (reply_to_message) {
        console.log(`[Telegram Webhook] Replying to message: "${reply_to_message.text}"`);
      }

      if (reply_to_message && reply_to_message.text && text) {
        // Parse Custom Trip ID from the bot message text (Request ID: #uuid)
        const match = reply_to_message.text.match(/Request ID:\s*#([a-zA-Z0-9-]+)/i);
        const tripId = match ? match[1] : null;
        console.log(`[Telegram Webhook] Parsed Trip ID: "${tripId}"`);

        if (tripId) {
          // Parse price from the beginning of the admin's reply (e.g. $45 or 45, followed by optional note)
          const priceMatch = text.trim().match(/^(\$?(\d+(\.\d{1,2})?))\s*(.*)$/);
          console.log(`[Telegram Webhook] Price Match Result:`, priceMatch);
          
          let approved = false;
          if (priceMatch) {
            const priceValStr = priceMatch[2];
            const price = parseFloat(priceValStr);
            const remainingText = priceMatch[4]?.trim() || '';
            console.log(`[Telegram Webhook] Price parsed: ${price}, Remaining text/note: "${remainingText}"`);

            if (price !== null && !isNaN(price) && price > 0) {
              approved = true;
              const noteText = remainingText || 'Approved & Quoted via Telegram Reply';
              try {
                console.log(`[Telegram Webhook] Updating status for Trip ID ${tripId} to approved...`);
                // Approve and Quote Custom Trip via standard service
                await customTripService.updateStatus(tripId, 'approved', noteText, price);
                console.log(`[Telegram Webhook] Database update successful for Trip ID ${tripId}.`);

                // Confirm success in admin Telegram chat
                sendTelegramRequest('sendMessage', {
                  chat_id: message.chat.id,
                  text: `✅ <b>Trip Request Approved!</b>\nQuoted Price: <b>$${price.toFixed(2)}</b>\nNote: <i>"${noteText}"</i>\nTraveler has been notified.`,
                  parse_mode: 'HTML',
                  reply_to_message_id: message.message_id
                });

                // Detect if this is replying to a force-reply message containing "Ref: [message_id]"
                const refMatch = reply_to_message.text.match(/Ref:\s*(\d+)/i);
                if (refMatch) {
                  const originalMsgId = parseInt(refMatch[1]);
                  const chatId = message.chat.id;
                  console.log(`[Telegram Webhook] Found Ref message link. Removing buttons from original message ID ${originalMsgId}...`);
                  
                  // 1. Remove inline buttons from the original alert message
                  sendTelegramRequest('editMessageReplyMarkup', {
                    chat_id: chatId,
                    message_id: originalMsgId,
                    reply_markup: { inline_keyboard: [] }
                  });

                  // 2. Edit the force-reply message to display the final approval summary
                  const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
                  sendTelegramRequest('editMessageText', {
                    chat_id: chatId,
                    message_id: reply_to_message.message_id,
                    text: `✅ <b>Custom Trip Request ID: #${tripId} Approved</b>\n💰 <b>Quoted Price:</b> $${price.toFixed(2)}\n💬 <b>Note:</b> "${noteText}"\n📅 <i>Processed At: ${formattedTimestamp}</i>`,
                    parse_mode: 'HTML'
                  });
                } else {
                  // Direct reply to original alert message
                  const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
                  sendTelegramRequest('editMessageText', {
                    chat_id: message.chat.id,
                    message_id: reply_to_message.message_id,
                    text: reply_to_message.text + `\n\n<b>Processed:</b> APPROVED (via Telegram Admin)\n💰 <b>Quoted Price:</b> $${price.toFixed(2)}\n💬 <b>Note:</b> "${noteText}"\n📅 <i>Processed At: ${formattedTimestamp}</i>`,
                    parse_mode: 'HTML'
                  });
                }
              } catch (dbErr) {
                console.error('[Telegram Webhook] Database approval/quote update failed:', dbErr);
                sendTelegramRequest('sendMessage', {
                  chat_id: message.chat.id,
                  text: `❌ Failed to approve trip request: ${dbErr.message || 'database error'}.`,
                  reply_to_message_id: message.message_id
                });
              }
            }
          }

          if (!approved) {
            console.log(`[Telegram Webhook] Message did not parse as a price. Forwarding message to traveler...`);
            // Forward custom text message to traveler
            try {
              const tripReq = await CustomTripRequest.findByPk(tripId);
              if (!tripReq) throw new Error('Trip request not found');

              // Update custom trip request admin note, keeping it in pending status
              await tripReq.update({ admin_note: text });

              // Create notification for traveler
              await Notification.create({
                user_id: tripReq.traveler_id,
                title: 'New Message from Admin',
                message: `Admin sent a response about your custom trip from ${tripReq.origin} to ${tripReq.destination}: "${text}"`
              });

              // Confirm success in Telegram chat
              sendTelegramRequest('sendMessage', {
                chat_id: message.chat.id,
                text: `✉️ <b>Message forwarded to traveler!</b>\nYour response has been posted to their dashboard.`,
                parse_mode: 'HTML',
                reply_to_message_id: message.message_id
              });

              // Detect if this is replying to a force-reply message containing "Ref: [message_id]"
              const refMatch = reply_to_message.text.match(/Ref:\s*(\d+)/i);
              if (refMatch) {
                const chatId = message.chat.id;
                // Update the force-reply message text to show that the comment was forwarded
                sendTelegramRequest('editMessageText', {
                  chat_id: chatId,
                  message_id: reply_to_message.message_id,
                  text: `✉️ <b>Response forwarded for Request ID: #${tripId}</b>\n💬 <i>"${text}"</i>`,
                  parse_mode: 'HTML'
                });
              } else {
                // Direct reply to original message, append to original conversation log keeping buttons active
                const inlineKeyboardButtons = [
                  [
                    { text: '✅ Approve', callback_data: `approve_trip:${tripId}` },
                    { text: '❌ Reject', callback_data: `reject_trip:${tripId}` }
                  ]
                ];
                if (tripReq.telegram_contact) {
                  const contact = tripReq.telegram_contact.trim();
                  const username = contact.startsWith('@') ? contact.substring(1) : contact;
                  if (/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
                    inlineKeyboardButtons.push([
                      { text: '💬 Chat with Traveler', url: `https://t.me/${username}` }
                    ]);
                  }
                }

                const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
                sendTelegramRequest('editMessageText', {
                  chat_id: message.chat.id,
                  message_id: reply_to_message.message_id,
                  text: reply_to_message.text + `\n\n<b>💬 Latest Admin Response:</b>\n"${text}"\n📅 <i>Sent At: ${formattedTimestamp}</i>`,
                  parse_mode: 'HTML',
                  reply_markup: { inline_keyboard: inlineKeyboardButtons }
                });
              }
            } catch (dbErr) {
              console.error('[Telegram Webhook] Failed to forward admin text response:', dbErr);
              sendTelegramRequest('sendMessage', {
                chat_id: message.chat.id,
                text: `❌ Failed to forward message to traveler: ${dbErr.message || 'database error'}.`,
                reply_to_message_id: message.message_id
              });
            }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error handling Telegram Webhook request:', err.message);
    res.sendStatus(200); // Send 200 so Telegram doesn't retry
  }
};

module.exports = { handleWebhook };
