const paymentService = require('../services/payment_service');
const { successResponse } = require('../utils/response');

const create = async (req, res, next) => {
  try {
    const data = await paymentService.create(req.user.id, req.body);
    try {
      const { User } = require('../../models');
      const user = await User.findByPk(req.user.id);
      const travelerName = user ? user.full_name : 'Unknown Traveler';

      const { sendTelegramAlert } = require('../utils/telegram');
      const appUrl = process.env.APP_URL || 'http://localhost:5000';
      sendTelegramAlert(
        `💳 <b>New Payment Uploaded!</b>\n\n` +
        `<b>Payment ID:</b> #${data.id || 'N/A'}\n` +
        `<b>Booking ID:</b> #${req.body.booking_id || 'N/A'}\n` +
        `<b>Traveler:</b> ${travelerName}\n` +
        `<b>Amount Paid:</b> $${req.body.amount || '0.00'}\n` +
        `<b>Proof of Payment:</b> <a href="${appUrl}${req.body.proof_url}">View Document</a>`
      );
    } catch (err) {
      console.error('Failed to trigger Telegram notification:', err);
    }
    res.status(201).json(successResponse('Payment record created', data));
  }
  catch (e) { next(e); }
};

const getAll = async (req, res, next) => {
  try { res.json(successResponse('Payments fetched', await paymentService.getAll())); }
  catch (e) { next(e); }
};

const verify = async (req, res, next) => {
  try { res.json(successResponse('Payment verified', await paymentService.verify(req.params.id, req.user.id))); }
  catch (e) { next(e); }
};

const reject = async (req, res, next) => {
  try { res.json(successResponse('Payment rejected', await paymentService.reject(req.params.id, req.user.id))); }
  catch (e) { next(e); }
};

const getCheckout = async (req, res, next) => {
  try { res.json(successResponse('Checkout session fetched', await paymentService.getOrCreateCheckout(req.user.id, req.params.bookingId))); }
  catch (e) { next(e); }
};

const simulateKHQR = async (req, res, next) => {
  try { res.json(successResponse('Payment simulated successfully', await paymentService.simulateKHQRPay(req.params.bookingId))); }
  catch (e) { next(e); }
};

const getStatus = async (req, res, next) => {
  try {
    res.json(successResponse('Payment status fetched', await paymentService.getStatus(req.user.id, req.params.bookingId)));
  } catch (e) { next(e); }
};

const createStripeSession = async (req, res, next) => {
  try {
    res.json(successResponse('Stripe session created', await paymentService.createStripeSession(req.user.id, req.params.bookingId)));
  } catch (e) { next(e); }
};

const verifyStripePayment = async (req, res, next) => {
  try {
    res.json(successResponse('Stripe payment verified', await paymentService.verifyStripePayment(req.user.id, req.params.bookingId)));
  } catch (e) { next(e); }
};

module.exports = { create, getAll, verify, reject, getCheckout, simulateKHQR, getStatus, createStripeSession, verifyStripePayment };
