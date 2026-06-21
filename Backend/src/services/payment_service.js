const { PaymentRecord, Booking, User, sequelize } = require('../../models');

const create = async (travelerId, { booking_id, payment_method, proof_url }) => {
  const booking = await Booking.findOne({ where: { id: booking_id, traveler_id: travelerId } });
  if (!booking) throw { status: 404, message: 'Booking not found' };
  
  const payment = await PaymentRecord.create({ booking_id, traveler_id: travelerId, amount: booking.total_fare, payment_method, proof_url });

  // Create system notification for all Admins
  try {
    const { Notification } = require('../../models');
    const traveler = await User.findByPk(travelerId);
    const travelerName = traveler ? traveler.full_name : 'Traveler';
    const admins = await User.findAll({ where: { role: 'admin' } });
    for (const admin of admins) {
      await Notification.create({
        user_id: admin.id,
        title: 'New Payment Uploaded',
        message: `Traveler ${travelerName} uploaded a receipt of $${parseFloat(booking.total_fare).toFixed(2)} for ride #${booking_id}. Verification pending.`
      });
    }
  } catch (notifyErr) {
    console.error('Failed to notify admins of manual payment:', notifyErr);
  }

  return payment;
};

const getAll = async () =>
  PaymentRecord.findAll({
    include: [
      { model: User,    as: 'traveler', attributes: ['full_name'] },
      { model: Booking, as: 'booking',  attributes: ['booking_type', 'total_fare'] },
    ],
    order: [['created_at', 'DESC']],
  });

const verify = async (id, adminId) => {
  const t = await sequelize.transaction();
  try {
    const payment = await PaymentRecord.findOne({ where: { id, status: 'pending' }, transaction: t });
    if (!payment) throw { status: 400, message: 'Payment not found or already processed' };
    await payment.update({ status: 'verified', verified_by: adminId, verified_at: new Date() }, { transaction: t });
    await Booking.update({ status: 'payment_verified' }, { where: { id: payment.booking_id }, transaction: t });
    await t.commit();

    // Trigger auto-dispatch asynchronously
    try {
      const bookingService = require('./booking_service');
      await bookingService.autoDispatch(payment.booking_id);
    } catch (dispatchError) {
      console.error('Auto dispatch error:', dispatchError);
    }

    return payment;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const reject = async (id, adminId) => {
  const payment = await PaymentRecord.findOne({ where: { id, status: 'pending' } });
  if (!payment) throw { status: 400, message: 'Payment not found or already processed' };
  await payment.update({ status: 'rejected', verified_by: adminId, verified_at: new Date() });
  return payment;
};

const getOrCreateCheckout = async (travelerId, bookingId) => {
  const booking = await Booking.findOne({ where: { id: bookingId, traveler_id: travelerId } });
  if (!booking) throw { status: 404, message: 'Booking not found' };
  
  let payment = await PaymentRecord.findOne({ where: { booking_id: bookingId } });
  if (!payment) {
    payment = await PaymentRecord.create({
      booking_id: bookingId,
      traveler_id: travelerId,
      amount: booking.total_fare,
      payment_method: 'KHQR',
      status: 'pending'
    });
  }
  
  let qrString = '';
  const accountId = process.env.BAKONG_ACCOUNT_ID;

  if (accountId) {
    try {
      const { BakongKHQR, khqrData, IndividualInfo } = require('bakong-khqr');
      
      const individualInfo = new IndividualInfo(
        accountId,
        process.env.BAKONG_MERCHANT_NAME || 'TaxiTrio',
        'Phnom Penh',
        {
          currency: process.env.BAKONG_CURRENCY === 'KHR' ? khqrData.currency.khr : khqrData.currency.usd,
          amount: parseFloat(booking.total_fare),
          billNumber: `#${booking.id}`,
          expirationTimestamp: Date.now() + (30 * 60 * 1000) // QR code valid for 30 minutes
        }
      );
      
      const khqr = new BakongKHQR();
      const response = khqr.generateIndividual(individualInfo);
      
      if (response && response.data && response.data.qr) {
        qrString = response.data.qr;
      } else {
        throw new Error(response.status ? response.status.message : 'QR generation failed in bakong-khqr SDK');
      }
    } catch (err) {
      console.error('Error generating KHQR with SDK, falling back to mock:', err);
      qrString = `00020101021238580010A000000765011000000000010212MCKH000188980306Bakong520459995303116540${parseFloat(booking.total_fare).toFixed(2)}5802KH5908TaxiTrio6010Phnom Penh6304ABCD`;
    }
  } else {
    // Fallback Mock QR code if account is not configured in .env
    qrString = `00020101021238580010A000000765011000000000010212MCKH000188980306Bakong520459995303116540${parseFloat(booking.total_fare).toFixed(2)}5802KH5908TaxiTrio6010Phnom Penh6304ABCD`;
  }

  return {
    payment,
    qrString,
    booking_type: booking.booking_type,
    pickup_location: booking.pickup_location,
    dropoff_location: booking.dropoff_location
  };
};

const getStatus = async (travelerId, bookingId) => {
  const payment = await PaymentRecord.findOne({
    where: { booking_id: bookingId, traveler_id: travelerId }
  });
  if (!payment) throw { status: 404, message: 'Payment record not found' };

  return {
    status: payment.status,
    amount: payment.amount,
    payment_method: payment.payment_method
  };
};

const simulateKHQRPay = async (bookingId) => {
  const t = await sequelize.transaction();
  try {
    const payment = await PaymentRecord.findOne({ where: { booking_id: bookingId, status: 'pending' }, transaction: t });
    if (!payment) throw { status: 400, message: 'Payment not found or already verified' };
    
    await payment.update({
      status: 'verified',
      verified_at: new Date(),
      proof_url: '/uploads/mock-khqr-verified.png'
    }, { transaction: t });
    
    await Booking.update({ status: 'payment_verified' }, { where: { id: bookingId }, transaction: t });
    await t.commit();

    // Create system notification for all Admins
    try {
      const { Notification, User } = require('../../models');
      const traveler = await User.findByPk(payment.traveler_id);
      const travelerName = traveler ? traveler.full_name : 'Traveler';
      const admins = await User.findAll({ where: { role: 'admin' } });
      for (const admin of admins) {
        await Notification.create({
          user_id: admin.id,
          title: 'New Paid Booking (Simulation)',
          message: `Traveler ${travelerName} simulated payment of $${parseFloat(payment.amount).toFixed(2)} for ride #${bookingId}.`
        });
      }
    } catch (notifyErr) {
      console.error('Failed to create admin notification during simulation:', notifyErr);
    }

    try {
      const bookingService = require('./booking_service');
      await bookingService.autoDispatch(bookingId);
    } catch (dispatchError) {
      console.error('Auto dispatch error during KHQR simulation:', dispatchError);
    }

    return payment;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const createStripeSession = async (travelerId, bookingId) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    throw { status: 500, message: 'Stripe is not configured on this server.' };
  }

  const stripe = require('stripe')(stripeSecret);
  const booking = await Booking.findOne({ where: { id: bookingId, traveler_id: travelerId } });
  if (!booking) throw { status: 404, message: 'Booking not found' };

  let payment = await PaymentRecord.findOne({ where: { booking_id: bookingId } });
  if (!payment) {
    payment = await PaymentRecord.create({
      booking_id: bookingId,
      traveler_id: travelerId,
      amount: booking.total_fare,
      payment_method: 'Stripe',
      status: 'pending'
    });
  } else {
    await payment.update({ payment_method: 'Stripe' });
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `TaxiTrio Booking - ${booking.booking_type.replace(/_/g, ' ').toUpperCase()}`,
          description: `Ride from ${booking.pickup_location} to ${booking.dropoff_location}`,
        },
        unit_amount: Math.round(parseFloat(booking.total_fare) * 100), // in cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${frontendUrl}/traveler/bookings/${bookingId}?stripe=success`,
    cancel_url: `${frontendUrl}/traveler/bookings/payment/${bookingId}?stripe=cancel`,
    metadata: {
      bookingId: bookingId.toString(),
      paymentId: payment.id.toString(),
      travelerId: travelerId.toString()
    }
  });

  return { sessionUrl: session.url };
};

const verifyStripePayment = async (travelerId, bookingId) => {
  const payment = await PaymentRecord.findOne({ where: { booking_id: bookingId, traveler_id: travelerId } });
  if (!payment) throw { status: 404, message: 'Payment record not found' };

  if (payment.status === 'verified') {
    return payment;
  }

  const t = await sequelize.transaction();
  try {
    await payment.update({
      status: 'verified',
      verified_at: new Date(),
      proof_url: '/uploads/stripe-card-payment.png'
    }, { transaction: t });

    await Booking.update({ status: 'payment_verified' }, { where: { id: bookingId }, transaction: t });
    await t.commit();

    // Create system notification for all Admins
    try {
      const { Notification, User } = require('../../models');
      const traveler = await User.findByPk(travelerId);
      const travelerName = traveler ? traveler.full_name : 'Traveler';
      const admins = await User.findAll({ where: { role: 'admin' } });
      for (const admin of admins) {
        await Notification.create({
          user_id: admin.id,
          title: 'New Paid Booking (Stripe)',
          message: `Traveler ${travelerName} paid $${parseFloat(payment.amount).toFixed(2)} via Stripe for ride #${bookingId}.`
        });
      }
    } catch (notifyErr) {
      console.error('Failed to create admin notification for Stripe:', notifyErr);
    }

    try {
      const bookingService = require('./booking_service');
      await bookingService.autoDispatch(bookingId);
    } catch (dispatchError) {
      console.error('Auto dispatch error during Stripe confirmation:', dispatchError);
    }

    return payment;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

module.exports = { create, getAll, verify, reject, getOrCreateCheckout, getStatus, simulateKHQRPay, createStripeSession, verifyStripePayment };
