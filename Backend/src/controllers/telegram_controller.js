const { CustomTripRequest, Notification } = require('../../models');
const https = require('https');

const handleWebhook = async (req, res) => {
  try {
    const { callback_query } = req.body;

    if (callback_query) {
      const { data, message, id: callback_query_id } = callback_query;
      const [action, tripId] = data.split(':');

      if (action === 'approve_trip' || action === 'reject_trip') {
        const newStatus = action === 'approve_trip' ? 'approved' : 'rejected';
        
        // Find the custom trip request
        const trip = await CustomTripRequest.findByPk(tripId);
        if (!trip) {
          console.warn(`Trip request ${tripId} not found for Telegram action.`);
          return res.sendStatus(200); // Send 200 so Telegram doesn't keep retrying
        }

        // Update database status
        await trip.update({
          status: newStatus,
          admin_note: `Actioned via Telegram Admin: ${newStatus.toUpperCase()}`
        });

        // Create notification for traveler
        await Notification.create({
          user_id: trip.traveler_id,
          title: `Custom Trip Request ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your custom trip request from ${trip.origin} to ${trip.destination} has been ${newStatus}.` +
            (newStatus === 'approved' && trip.quoted_price ? ` Quoted price: $${trip.quoted_price}.` : '') +
            ` Note: Actioned via Telegram Admin Action`
        });

        // 1. Answer callback query to stop the loading spinner in Telegram app
        const answerPayload = JSON.stringify({
          callback_query_id: callback_query_id,
          text: `Trip request has been ${newStatus}!`
        });

        const answerOptions = {
          hostname: 'api.telegram.org',
          port: 443,
          path: `/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(answerPayload)
          }
        };

        const answerReq = https.request(answerOptions);
        answerReq.write(answerPayload);
        answerReq.end();

        // 2. Edit the original alert message on Telegram to reflect the changes and remove the buttons
        const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
        const editPayload = JSON.stringify({
          chat_id: message.chat.id,
          message_id: message.message_id,
          text: message.text + `\n\n<b>Processed:</b> ${newStatus.toUpperCase()} (via Telegram Admin)\n📅 <i>Processed At: ${formattedTimestamp}</i>`,
          parse_mode: 'HTML'
        });

        const editOptions = {
          hostname: 'api.telegram.org',
          port: 443,
          path: `/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(editPayload)
          }
        };

        const editReq = https.request(editOptions);
        editReq.write(editPayload);
        editReq.end();
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error handling Telegram Webhook callback query:', err.message);
    res.sendStatus(200); // Send 200 so Telegram doesn't retry
  }
};

module.exports = { handleWebhook };
