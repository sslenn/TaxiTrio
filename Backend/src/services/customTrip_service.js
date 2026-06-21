const { CustomTripRequest, User, Notification, Booking, BookingStatusHistory } = require('../../models');

const create = async (travelerId, data) => {
  const existingPending = await CustomTripRequest.findOne({
    where: { traveler_id: travelerId, status: 'pending' }
  });
  if (existingPending) {
    throw { status: 400, message: 'You already have a pending custom trip request. Please wait for the administrator to review it.' };
  }
  return CustomTripRequest.create({ ...data, traveler_id: travelerId });
};

const getAll = async () =>
  CustomTripRequest.findAll({
    include: [{ model: User, as: 'traveler', attributes: ['full_name', 'phone'] }],
    order: [['created_at', 'DESC']],
  });

const updateStatus = async (id, status, admin_note, quoted_price) => {
  const req = await CustomTripRequest.findByPk(id);
  if (!req) throw { status: 404, message: 'Request not found' };

  if (status === 'approved') {
    if (!quoted_price || isNaN(quoted_price) || parseFloat(quoted_price) <= 0) {
      throw { status: 400, message: 'A valid quoted price is required to approve the trip.' };
    }
  }

  await req.update({ status, admin_note, quoted_price });

  // Create notification for traveler
  await Notification.create({
    user_id: req.traveler_id,
    title: `Custom Trip Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
    message: `Your custom trip request from ${req.origin} to ${req.destination} has been ${status}.` +
      (status === 'approved' && quoted_price ? ` Quoted price: $${quoted_price}.` : '') +
      (admin_note ? ` Note: ${admin_note}` : '')
  });

  return req;
};

const getMyRequests = async (travelerId) =>
  CustomTripRequest.findAll({
    where: { traveler_id: travelerId },
    order: [['created_at', 'DESC']],
  });

const confirmRequest = async (id, travelerId, { traveler_response, telegram_contact, origin, destination, travel_date, travel_time }) => {
  const req = await CustomTripRequest.findOne({ where: { id, traveler_id: travelerId } });
  if (!req) throw { status: 404, message: 'Request not found' };
  if (req.status !== 'approved') {
    throw { status: 400, message: 'Can only confirm details for approved trip requests.' };
  }

  let pickupTime = null;
  if (travel_date && travel_time) {
    pickupTime = new Date(`${travel_date}T${travel_time}`);
  }

  // Create a new Booking in 'pending_payment' status
  const booking = await Booking.create({
    traveler_id: travelerId,
    booking_type: 'intercity',
    status: 'pending_payment',
    pickup_location: origin,
    dropoff_location: destination,
    pickup_time: pickupTime,
    total_fare: req.quoted_price,
    notes: traveler_response || `Bespoke Custom Trip Request #${req.id}`
  });

  await BookingStatusHistory.create({
    booking_id: booking.id,
    status: 'pending_payment',
    changed_by: travelerId
  });

  // Generate Stripe Checkout Session URL immediately for this booking
  const paymentService = require('./payment_service');
  const sessionRes = await paymentService.createStripeSession(travelerId, booking.id);

  await req.update({ traveler_response, telegram_contact, origin, destination, travel_date, travel_time });
  
  return {
    customTrip: req,
    bookingId: booking.id,
    sessionUrl: sessionRes.sessionUrl
  };
};

const markUrgent = async (id, travelerId) => {
  const req = await CustomTripRequest.findOne({ where: { id, traveler_id: travelerId } });
  if (!req) throw { status: 404, message: 'Request not found' };
  return req;
};

module.exports = { create, getAll, updateStatus, getMyRequests, confirmRequest, markUrgent };

