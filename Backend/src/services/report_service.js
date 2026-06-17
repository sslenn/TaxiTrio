const { fn, col, literal, Op } = require('sequelize');
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
    sequelize.query(
      `SELECT DATE_TRUNC('month', created_at) AS month,
              COALESCE(SUM(total_fare), 0) AS total_revenue
       FROM bookings WHERE status = 'completed'
       GROUP BY 1 ORDER BY 1 DESC LIMIT 12`,
      { type: sequelize.QueryTypes.SELECT }
    ),
    sequelize.query(
      `SELECT u.id, u.full_name,
              ROUND(AVG(r.rating)::numeric, 2) AS avg_rating,
              COUNT(r.id) AS reviews
       FROM users u
       JOIN reviews r ON u.id = r.driver_id
       WHERE u.role = 'driver'
       GROUP BY u.id, u.full_name
       ORDER BY avg_rating DESC NULLS LAST
       LIMIT 5`,
      { type: sequelize.QueryTypes.SELECT }
    ),
  ]);

  return { bookings: bookingStats, users: userStats, monthly_revenue: monthlyRevenue, top_drivers: topDrivers };
};

module.exports = { getStats };
