const { Review, Booking } = require('../../models');

const create = async (travelerId, { booking_id, rating, comment }) => {
  const booking = await Booking.findOne({ where: { id: booking_id, traveler_id: travelerId, status: 'completed' } });
  if (!booking) throw { status: 400, message: 'Can only review completed bookings' };
  return Review.create({ booking_id, traveler_id: travelerId, driver_id: booking.driver_id, rating, comment });
};

module.exports = { create };
