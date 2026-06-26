const paymentService = require('../services/payment/paymentService');
const { successResponse } = require('../utils/response');

const createPayment = async (req, res, next) => {
  try {
    const { method, amount, bookingId, metadata } = req.body;
    const travelerId = req.user.id;
    const result = await paymentService.createPayment({
      method,
      amount,
      bookingId,
      travelerId,
      metadata
    });
    res.json(successResponse('Payment session created', result));
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { method } = req.query; // stripe, khqr or cash
    const result = await paymentService.verifyPayment({ method, bookingId: paymentId });
    res.json(successResponse('Payment verification completed', result));
  } catch (err) {
    next(err);
  }
};

const handleStripeWebhook = async (req, res, next) => {
  try {
    const result = await paymentService.processWebhook('stripe', req);
    res.json({ received: true, processed: result.success });
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

const handleKHQRWebhook = async (req, res, next) => {
  try {
    const result = await paymentService.processWebhook('khqr', req);
    res.json({ received: true, processed: result.success });
  } catch (err) {
    console.error('KHQR webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Gateway endpoints matching specific user requirements
const gatewayCreateKHQRPayment = async (req, res, next) => {
  try {
    const { amount, bookingId } = req.body;
    const result = await paymentService.createPayment({
      method: 'khqr',
      amount,
      bookingId,
      travelerId: req.user.id
    });
    res.json({
      paymentId: result.paymentId,
      qrImage: result.qrImage,
      expiresAt: result.expiresAt,
      status: result.status
    });
  } catch (err) {
    next(err);
  }
};

const gatewayGetKHQRPaymentStatus = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const result = await paymentService.verifyPayment({ method: 'khqr', bookingId: paymentId });
    res.json({
      paymentId,
      status: result.status === 'PAID' ? 'SUCCESS' : 'PENDING'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  handleStripeWebhook,
  handleKHQRWebhook,
  gatewayCreateKHQRPayment,
  gatewayGetKHQRPaymentStatus
};
