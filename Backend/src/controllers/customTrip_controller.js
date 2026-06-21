const customTripService = require('../services/customTrip_service');
const { successResponse } = require('../utils/response');

const create = async (req, res, next) => {
  try {
    const data = await customTripService.create(req.user.id, req.body);
    try {
      const { User } = require('../../models');
      const user = await User.findByPk(req.user.id);
      const travelerName = user ? user.full_name : 'Unknown Traveler';

      const { sendTelegramAlert } = require('../utils/telegram');
      const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
      
      const inlineKeyboardButtons = [
        [
          { text: '✅ Approve', callback_data: `approve_trip:${data.id}` },
          { text: '❌ Reject', callback_data: `reject_trip:${data.id}` }
        ]
      ];

      if (req.body.telegram_contact) {
        const contact = req.body.telegram_contact.trim();
        const username = contact.startsWith('@') ? contact.substring(1) : contact;
        if (/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
          inlineKeyboardButtons.push([
            { text: '💬 Chat with Traveler', url: `https://t.me/${username}` }
          ]);
        }
      }

      sendTelegramAlert(
        `✈️ <b>New Custom Trip Request!</b>\n\n` +
        `<b>Request ID:</b> #${data.id || 'N/A'}\n` +
        `<b>Traveler:</b> ${travelerName}\n` +
        `<b>Origin:</b> ${req.body.origin}\n` +
        `<b>Destination:</b> ${req.body.destination}\n` +
        `<b>Date:</b> ${req.body.travel_date}\n` +
        (req.body.travel_time ? `<b>Time:</b> ${req.body.travel_time}\n` : '') +
        `<b>Passengers:</b> ${req.body.passengers}\n\n` +
        `📅 <i>Transaction Date/Time: ${formattedTimestamp}</i>`,
        {
          inline_keyboard: inlineKeyboardButtons
        }
      );
    } catch (err) {
      console.error('Failed to trigger Telegram notification:', err);
    }
    res.status(201).json(successResponse('Request submitted', data));
  }
  catch (e) { next(e); }
};

const getAll = async (req, res, next) => {
  try { res.json(successResponse('Requests fetched', await customTripService.getAll())); }
  catch (e) { next(e); }
};

const getMyRequests = async (req, res, next) => {
  try { res.json(successResponse('My requests fetched', await customTripService.getMyRequests(req.user.id))); }
  catch (e) { next(e); }
};

const confirmRequest = async (req, res, next) => {
  try {
    const data = await customTripService.confirmRequest(req.params.id, req.user.id, req.body);
    const customTrip = data.customTrip;
    
    try {
      const { User, Notification } = require('../../models');
      const admins = await User.findAll({ where: { role: 'admin' } });
      const traveler = await User.findByPk(req.user.id);
      const travelerName = traveler ? traveler.full_name : 'Traveler';

      for (const admin of admins) {
        await Notification.create({
          user_id: admin.id,
          title: 'Custom Trip Confirmed by Traveler',
          message: `Traveler ${travelerName} has confirmed details. Booking #${data.bookingId} created. Telegram: ${req.body.telegram_contact || 'None'}.`
        });
      }

      const { sendTelegramAlert } = require('../utils/telegram');
      const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
      
      const inlineKeyboardButtons = [];
      if (req.body.telegram_contact) {
        const contact = req.body.telegram_contact.trim();
        const username = contact.startsWith('@') ? contact.substring(1) : contact;
        if (/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
          inlineKeyboardButtons.push([
            { text: '💬 Chat with Traveler', url: `https://t.me/${username}` }
          ]);
        }
      }

      sendTelegramAlert(
        `📬 <b>Custom Trip Details Confirmed!</b>\n\n` +
        `<b>Request ID:</b> #${customTrip.id}\n` +
        `<b>Booking ID:</b> #${data.bookingId}\n` +
        `<b>Traveler:</b> ${travelerName}\n` +
        `<b>Telegram Username:</b> ${req.body.telegram_contact || 'N/A'}\n` +
        `<b>Route:</b> ${customTrip.origin} → ${customTrip.destination}\n` +
        `<b>Date:</b> ${customTrip.travel_date}\n` +
        (customTrip.travel_time ? `<b>Time:</b> ${customTrip.travel_time}\n` : '') +
        `<b>Passengers:</b> ${customTrip.passengers} pax\n` +
        `<b>Confirmation Notes:</b> ${req.body.traveler_response || 'N/A'}\n\n` +
        `📅 <i>Transaction Date/Time: ${formattedTimestamp}</i>`,
        inlineKeyboardButtons.length > 0 ? { inline_keyboard: inlineKeyboardButtons } : null
      );
    } catch (err) {
      console.error('Failed to send confirmation alerts:', err);
    }

    res.json(successResponse('Request confirmed successfully', data));
  } catch (e) { next(e); }
};

const markUrgent = async (req, res, next) => {
  try {
    const data = await customTripService.markUrgent(req.params.id, req.user.id);
    
    try {
      const { User, Notification } = require('../../models');
      const admins = await User.findAll({ where: { role: 'admin' } });
      const traveler = await User.findByPk(req.user.id);
      const travelerName = traveler ? traveler.full_name : 'Traveler';

      for (const admin of admins) {
        await Notification.create({
          user_id: admin.id,
          title: '🚨 URGENT support request',
          message: `Traveler ${travelerName} requested urgent assistance for Custom Trip #${data.id.substring(0, 8)}. Telegram contact: ${data.telegram_contact || 'None'}.`
        });
      }

      const { sendTelegramAlert } = require('../utils/telegram');
      const formattedTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
      
      const inlineKeyboardButtons = [];
      if (data.telegram_contact) {
        const contact = data.telegram_contact.trim();
        const username = contact.startsWith('@') ? contact.substring(1) : contact;
        if (/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
          inlineKeyboardButtons.push([
            { text: '💬 Chat with Traveler', url: `https://t.me/${username}` }
          ]);
        }
      }

      sendTelegramAlert(
        `🚨 <b>URGENT ASSISTANCE REQUESTED!</b> 🚨\n\n` +
        `<b>Traveler:</b> ${travelerName}\n` +
        `<b>Request ID:</b> #${data.id}\n` +
        `<b>Telegram Handle:</b> ${data.telegram_contact || 'N/A'}\n` +
        `<b>Route:</b> ${data.origin} → ${data.destination}\n` +
        `<b>Date:</b> ${data.travel_date}\n` +
        (data.travel_time ? `<b>Time:</b> ${data.travel_time}\n` : '') +
        `<b>Passengers:</b> ${data.passengers} pax\n\n` +
        `⚠️ Please contact the traveler immediately.\n\n` +
        `📅 <i>Transaction Date/Time: ${formattedTimestamp}</i>`,
        inlineKeyboardButtons.length > 0 ? { inline_keyboard: inlineKeyboardButtons } : null
      );
    } catch (err) {
      console.error('Failed to send urgent alerts:', err);
    }

    res.json(successResponse('Urgent support request submitted', data));
  } catch (e) { next(e); }
};

const approve = async (req, res, next) => {
  try {
    const data = await customTripService.updateStatus(req.params.id, 'approved', req.body.admin_note, req.body.quoted_price);
    res.json(successResponse('Request approved', data));
  } catch (e) { next(e); }
};

const reject = async (req, res, next) => {
  try {
    const data = await customTripService.updateStatus(req.params.id, 'rejected', req.body.admin_note);
    res.json(successResponse('Request rejected', data));
  } catch (e) { next(e); }
};

module.exports = { create, getAll, getMyRequests, confirmRequest, markUrgent, approve, reject };
