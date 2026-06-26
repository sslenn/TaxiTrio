const PaymentFactory = require('./paymentFactory');
const { Booking, PaymentRecord, User, Notification, sequelize } = require('../../../models');

class PaymentService {
  async createPayment({ method, amount, bookingId, travelerId, metadata = {} }) {
    if (method.toLowerCase() === 'cash') {
      let payment = await PaymentRecord.findOne({ where: { booking_id: bookingId } });
      if (!payment) {
        payment = await PaymentRecord.create({
          booking_id: bookingId,
          traveler_id: travelerId,
          amount: amount,
          payment_method: 'Cash',
          status: 'pending'
        });
      } else {
        await payment.update({ payment_method: 'Cash' });
      }
      return { paymentId: bookingId, status: 'PENDING', method: 'Cash' };
    }

    const provider = PaymentFactory.getProvider(method);
    const result = await provider.createPayment({ amount, bookingId, travelerId, metadata });
    
    let payment = await PaymentRecord.findOne({ where: { booking_id: bookingId } });
    if (!payment) {
      payment = await PaymentRecord.create({
        booking_id: bookingId,
        traveler_id: travelerId,
        amount: amount,
        payment_method: method.toUpperCase(),
        status: 'pending'
      });
    } else {
      await payment.update({ payment_method: method.toUpperCase(), status: 'pending' });
    }

    return {
      ...result,
      method: method.toUpperCase()
    };
  }

  async verifyPayment({ method, bookingId }) {
    if (method.toLowerCase() === 'cash') {
      const payment = await PaymentRecord.findOne({ where: { booking_id: bookingId } });
      return { status: payment && payment.status === 'verified' ? 'PAID' : 'PENDING' };
    }

    const provider = PaymentFactory.getProvider(method);
    return provider.verifyPayment({ paymentId: bookingId });
  }

  async processWebhook(method, req) {
    const provider = PaymentFactory.getProvider(method);
    const webhookResult = await provider.handleWebhook(req);

    if (webhookResult && webhookResult.status === 'PAID') {
      const { bookingId, travelerId, amount } = webhookResult;
      await this.confirmPayment(bookingId, travelerId, method, amount);
      return { success: true };
    }
    return { success: false };
  }

  async confirmPayment(bookingId, travelerId, method, amount) {
    const payment = await PaymentRecord.findOne({ where: { booking_id: bookingId } });
    if (!payment) throw new Error('Payment record not found');
    if (payment.status === 'verified') return payment;

    const t = await sequelize.transaction();
    try {
      await payment.update({
        status: 'verified',
        verified_at: new Date(),
        proof_url: method.toLowerCase() === 'stripe' ? '/uploads/stripe-card-payment.png' : '/uploads/khqr-mobile-payment.png'
      }, { transaction: t });

      await Booking.update({ status: 'payment_verified' }, { where: { id: bookingId }, transaction: t });
      await t.commit();

      try {
        const traveler = await User.findByPk(travelerId);
        const travelerName = traveler ? traveler.full_name : 'Traveler';

        // Dispatch Telegram Notification
        try {
          const { sendTelegramAlert } = require('../../utils/telegram');
          sendTelegramAlert(
            `✅ <b>Payment Received & Confirmed!</b>\n\n` +
            `<b>Booking ID:</b> #${bookingId}\n` +
            `<b>Traveler:</b> ${travelerName}\n` +
            `<b>Method:</b> ${method.toUpperCase()} (Scan / Webhook)\n` +
            `<b>Amount:</b> $${parseFloat(amount).toFixed(2)}\n` +
            `<b>Status:</b> PAID (Auto-Verified)`
          );
        } catch (teleErr) {
          console.error('Failed to send Telegram alert for payment confirmation:', teleErr);
        }

        const admins = await User.findAll({ where: { role: 'admin' } });
        for (const admin of admins) {
          await Notification.create({
            user_id: admin.id,
            title: `New Paid Booking (${method.toUpperCase()})`,
            message: `Traveler ${travelerName} paid $${parseFloat(amount).toFixed(2)} via ${method.toUpperCase()} for ride #${bookingId}.`,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      } catch (notifyErr) {
        console.error('Failed to create admin notification:', notifyErr);
      }

      try {
        const bookingService = require('../booking_service');
        await bookingService.autoDispatch(bookingId);
      } catch (dispatchError) {
        console.error('Auto dispatch error during payment confirmation:', dispatchError);
      }

      return payment;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}

module.exports = new PaymentService();
