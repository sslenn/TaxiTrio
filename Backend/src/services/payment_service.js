const { PaymentRecord, Booking, User, sequelize } = require('../../models');

const create = async (travelerId, { booking_id, payment_method, proof_url }) => {
  const booking = await Booking.findOne({ where: { id: booking_id, traveler_id: travelerId } });
  if (!booking) throw { status: 404, message: 'Booking not found' };
  return PaymentRecord.create({ booking_id, traveler_id: travelerId, amount: booking.total_fare, payment_method, proof_url });
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
  
  const qrString = `00020101021238580010A000000765011000000000010212MCKH000188980306Bakong520459995303116540${parseFloat(booking.total_fare).toFixed(2)}5802KH5908TaxiTrio6010Phnom Penh6304ABCD`;

  return {
    payment,
    qrString,
    booking_type: booking.booking_type,
    pickup_location: booking.pickup_location,
    dropoff_location: booking.dropoff_location
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

module.exports = { create, getAll, verify, reject, getOrCreateCheckout, simulateKHQRPay };
