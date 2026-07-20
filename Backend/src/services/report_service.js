const { fn, col, literal, Op, cast } = require('sequelize');
const { Booking, User, Review, sequelize } = require('../../models');

const getStats = async () => {
  const [bookingStats, bookingList, userStats, monthlyRevenue, topDrivers] = await Promise.all([
    // Aggregate counts
    Booking.findOne({
      attributes: [
        [fn('COUNT', col('Booking.id')), 'total'],
        [fn('COUNT', literal("CASE WHEN status='completed' THEN 1 END")), 'completed'],
        [fn('COUNT', literal("CASE WHEN status='cancelled' THEN 1 END")), 'cancelled'],
        [fn('COUNT', literal("CASE WHEN status='pending_payment' THEN 1 END")), 'pending_payment'],
      ],
      raw: true,
    }),

    // Full booking list for export (most recent 500)
    Booking.findAll({
      attributes: ['id', 'booking_type', 'status', 'pickup_location', 'dropoff_location', 'total_fare', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 500,
      raw: true,
    }),

    // User role counts
    User.findOne({
      attributes: [
        [fn('COUNT', literal("CASE WHEN role='traveler' THEN 1 END")), 'travelers'],
        [fn('COUNT', literal("CASE WHEN role='driver' THEN 1 END")), 'drivers'],
      ],
      raw: true,
    }),

    // Monthly revenue (last 12 months)
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

    // Top drivers: avg rating, reviews, completed trips, revenue
    User.findAll({
      attributes: [
        'id',
        'full_name',
        [fn('ROUND', cast(fn('AVG', col('driverReviews.rating')), 'numeric'), 2), 'avg_rating'],
        [fn('COUNT', col('driverReviews.id')), 'reviews'],
        [
          literal(`(
            SELECT COUNT(*) FROM bookings
            WHERE bookings.driver_id = "User"."id"
              AND bookings.status = 'completed'
          )`),
          'completed_bookings',
        ],
        [
          literal(`(
            SELECT COALESCE(SUM(total_fare), 0) FROM bookings
            WHERE bookings.driver_id = "User"."id"
              AND bookings.status = 'completed'
          )`),
          'revenue_generated',
        ],
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

  return {
    bookings: { ...bookingStats, list: bookingList },
    users: userStats,
    monthly_revenue: monthlyRevenue,
    top_drivers: topDrivers,
  };
};

module.exports = { getStats };
