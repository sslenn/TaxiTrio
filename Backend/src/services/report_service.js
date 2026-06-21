const { fn, col, literal, Op, cast } = require('sequelize');
const { Booking, User, Review, sequelize } = require('../../models');

const getStats = async () => {
  const [bookingStats, userStats, monthlyRevenue, topDrivers] = await Promise.all([
    Booking.findOne({
      attributes: [
        [fn('COUNT', col('Booking.id')), 'total'],
        [fn('COUNT', literal("CASE WHEN status='completed' THEN 1 END")), 'completed'],
        [fn('COUNT', literal("CASE WHEN status='cancelled' THEN 1 END")), 'cancelled'],
        [fn('COUNT', literal("CASE WHEN status='pending_payment' THEN 1 END")), 'pending_payment'],
      ],
      raw: true,
    }),
    User.findOne({
      attributes: [
        [fn('COUNT', literal("CASE WHEN role='traveler' THEN 1 END")), 'travelers'],
        [fn('COUNT', literal("CASE WHEN role='driver' THEN 1 END")), 'drivers'],
      ],
      raw: true,
    }),
    Booking.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('created_at')), 'month'],
        [fn('COALESCE', fn('SUM', col('total_fare')), 0), 'total_revenue'],
      ],
      where: { status: 'completed' },
      group: [fn('DATE_TRUNC', 'month', col('created_at'))],
      order: [[fn('DATE_TRUNC', 'month', col('created_at')), 'DESC']],
      limit: 12,
      raw: true,
    }),
    User.findAll({
      attributes: [
        'id',
        'full_name',
        [fn('ROUND', cast(fn('AVG', col('driverReviews.rating')), 'numeric'), 2), 'avg_rating'],
        [fn('COUNT', col('driverReviews.id')), 'reviews'],
      ],
      include: [
        {
          model: Review,
          as: 'driverReviews',
          attributes: [],
          required: true,
        },
      ],
      where: { role: 'driver' },
      group: ['User.id', 'User.full_name'],
      order: [[literal('avg_rating'), 'DESC NULLS LAST']],
      limit: 5,
      subQuery: false,
      raw: true,
    }),
  ]);

  return { bookings: bookingStats, users: userStats, monthly_revenue: monthlyRevenue, top_drivers: topDrivers };
};

module.exports = { getStats };
