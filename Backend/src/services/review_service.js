const { Review, Booking, User } = require('../../models');

const create = async (travelerId, { booking_id, rating, comment }) => {
  const booking = await Booking.findOne({
    where: { id: booking_id, traveler_id: travelerId, status: 'completed' },
  });
  if (!booking) throw { status: 400, message: 'Can only review completed bookings' };
  return Review.create({
    booking_id,
    traveler_id: travelerId,
    driver_id: booking.driver_id,
    rating,
    comment,
  });
};

const getTravelerReviews = async (travelerId) => {
  return Review.findAll({
    where: { traveler_id: travelerId },
    include: [
      {
        model: Booking,
        as: 'booking',
        attributes: ['id', 'booking_type', 'pickup_location', 'dropoff_location', 'pickup_time'],
      },
      {
        model: User,
        as: 'driver',
        attributes: ['full_name', 'email', 'avatar_url'],
      },
    ],
    order: [['created_at', 'DESC']],
  });
};

module.exports = { create, getTravelerReviews };
