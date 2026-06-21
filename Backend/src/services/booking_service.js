const { Op } = require('sequelize');
const { Booking, User, Vehicle, Route, TransportationPackage, BookingStatusHistory, Notification, PaymentRecord } = require('../../models');

const ACTIVE_STATUSES = ['driver_assigned', 'accepted', 'en_route', 'arrived', 'in_progress'];

const includes = [
  { model: User,    as: 'traveler', attributes: ['id', 'full_name', 'phone'] },
  { model: User,    as: 'driver',   attributes: ['id', 'full_name', 'phone'] },
  { model: Vehicle, as: 'vehicle',  attributes: ['plate_number', 'brand', 'model'] },
  { model: Route,   as: 'route',    attributes: ['origin', 'destination', 'base_price'] },
  { model: TransportationPackage, as: 'package', attributes: ['name', 'price'] },
  { model: PaymentRecord, as: 'payment', attributes: ['payment_method', 'amount', 'status', 'verified_at', 'created_at'] }
];

const estimate = async ({ pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, vehicle_type = 'sedan', booking_type = 'city_ride' }) => {
  let distance_km = 0;
  let duration_mins = 0;

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${pickup_lng},${pickup_lat};${dropoff_lng},${dropoff_lat}?overview=false`
    );
    const data = await response.json();

    if (data.code === 'Ok' && data.routes?.length > 0) {
      const route = data.routes[0];
      distance_km = route.distance / 1000;
      duration_mins = route.duration / 60;
    } else {
      throw new Error('OSRM routing failed');
    }
  } catch (err) {
    console.error('OSRM API error, falling back to Haversine approximation:', err);
    // Haversine fallback
    const R = 6371;
    const dLat = ((dropoff_lat - pickup_lat) * Math.PI) / 180;
    const dLon = ((dropoff_lng - pickup_lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickup_lat * Math.PI) / 180) *
        Math.cos((dropoff_lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance_km = R * c * 1.3;
    duration_mins = distance_km * 2.5;
  }

  const { PricingRule } = require('../../models');
  const rule = await PricingRule.findOne({
    where: { vehicle_type, booking_type, is_active: true }
  });

  if (!rule) {
    throw { status: 404, message: `Pricing rule not found for vehicle type: ${vehicle_type} and booking type: ${booking_type}` };
  }

  const base = parseFloat(rule.base_fare);
  const perKm = parseFloat(rule.per_km_rate);
  const perMin = parseFloat(rule.per_minute_rate);
  const surge = parseFloat(rule.surge_multiplier);

  const rawFare = (base + (distance_km * perKm) + (duration_mins * perMin)) * surge;
  const fare = parseFloat(Math.max(2.00, rawFare).toFixed(2));

  return {
    distance_km: parseFloat(distance_km.toFixed(2)),
    duration_mins: Math.round(duration_mins),
    fare
  };
};

const create = async (travelerId, body) => {
  const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, booking_type, vehicle_type = 'sedan' } = body;
  
  let totalFare = body.total_fare;
  let dist = body.distance_km;
  let dur = body.duration_mins;

  if (pickup_lat && pickup_lng && dropoff_lat && dropoff_lng) {
    const est = await estimate({
      pickup_lat: parseFloat(pickup_lat),
      pickup_lng: parseFloat(pickup_lng),
      dropoff_lat: parseFloat(dropoff_lat),
      dropoff_lng: parseFloat(dropoff_lng),
      vehicle_type,
      booking_type
    });
    totalFare = est.fare;
    dist = est.distance_km;
    dur = est.duration_mins;
  }

  const booking = await Booking.create({
    ...body,
    total_fare: totalFare,
    distance_km: dist,
    duration_mins: dur,
    traveler_id: travelerId
  });

  await BookingStatusHistory.create({ booking_id: booking.id, status: 'pending_payment', changed_by: travelerId });
  return booking;
};

const getMyBookings = async (travelerId) =>
  Booking.findAll({ where: { traveler_id: travelerId }, include: includes, order: [['created_at', 'DESC']] });

const getById = async (id, userId, role) => {
  const booking = await Booking.findByPk(id, { include: includes });
  if (!booking) throw { status: 404, message: 'Booking not found' };
  if (role !== 'admin' && booking.traveler_id !== userId && booking.driver_id !== userId)
    throw { status: 403, message: 'Forbidden' };
  return booking;
};

const cancel = async (id, travelerId) => {
  const booking = await Booking.findOne({
    where: { id, traveler_id: travelerId, status: 'pending_payment' },
  });
  if (!booking) throw { status: 400, message: 'Cannot cancel this booking' };
  await booking.update({ status: 'cancelled' });
  return booking;
};

const getAllAdmin = async () =>
  Booking.findAll({ include: includes, order: [['created_at', 'DESC']] });

const assignDriver = async (bookingId, driverId, vehicleId) => {
  const booking = await Booking.findOne({ where: { id: bookingId, status: { [Op.in]: ['payment_verified', 'rejected'] } } });
  if (!booking) throw { status: 400, message: 'Cannot assign driver to this booking' };
  await booking.update({ driver_id: driverId, vehicle_id: vehicleId, status: 'driver_assigned' });
  return booking;
};

const getDriverBookings = async (driverId) =>
  Booking.findAll({
    where: { driver_id: driverId, status: { [Op.in]: ACTIVE_STATUSES } },
    include: includes,
    order: [['pickup_time', 'ASC']],
  });

const autoDispatch = async (bookingId) => {
  const booking = await Booking.findOne({
    where: { id: bookingId, status: { [Op.in]: ['payment_verified', 'rejected'] } }
  });
  if (!booking) {
    console.log(`Booking ${bookingId} not found or not in payment_verified/rejected status for auto-dispatch`);
    return null;
  }

  // Find all busy drivers (currently in active bookings)
  const busyBookings = await Booking.findAll({
    where: {
      status: {
        [Op.in]: ['driver_assigned', 'accepted', 'en_route', 'arrived', 'in_progress']
      },
      driver_id: { [Op.ne]: null }
    },
    attributes: ['driver_id'],
    raw: true
  });
  const busyDriverIds = busyBookings.map(b => b.driver_id);

  // Find all drivers who previously rejected this booking
  const rejectedHistory = await BookingStatusHistory.findAll({
    where: {
      booking_id: bookingId,
      status: 'rejected'
    },
    attributes: ['changed_by'],
    raw: true
  });
  const rejectedDriverIds = rejectedHistory.map(h => h.changed_by).filter(id => id !== null);

  const excludedDriverIds = [...new Set([...busyDriverIds, ...rejectedDriverIds])];

  // Find an available vehicle and its active driver
  const vehicle = await Vehicle.findOne({
    where: {
      is_available: true,
      driver_id: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.notIn]: excludedDriverIds.length > 0 ? excludedDriverIds : ['00000000-0000-0000-0000-000000000000'] }
        ]
      }
    },
    include: [
      {
        model: User,
        as: 'driver',
        where: {
          role: 'driver',
          is_active: true
        }
      }
    ]
  });

  if (vehicle) {
    await booking.update({
      driver_id: vehicle.driver_id,
      vehicle_id: vehicle.id,
      status: 'driver_assigned'
    });

    await Notification.create({
      user_id: vehicle.driver_id,
      title: 'New Booking Assigned',
      message: `You have been assigned to a new booking (${booking.booking_type}) from ${booking.pickup_location} to ${booking.dropoff_location}.`
    });

    await Notification.create({
      user_id: booking.traveler_id,
      title: 'Driver Assigned',
      message: `A driver has been assigned to your ride #${booking.id} (${booking.booking_type.replace(/_/g, ' ').toUpperCase()}).`
    });

    console.log(`Booking ${bookingId} auto-assigned to driver ${vehicle.driver_id}`);
    return booking;
  } else {
    console.log(`No available driver/vehicle found for booking ${bookingId}`);
    return null;
  }
};

const updateDriverStatus = async (bookingId, driverId, status) => {
  const allowed = ['accepted', 'rejected', 'en_route', 'arrived', 'in_progress', 'completed'];
  if (!allowed.includes(status)) throw { status: 400, message: 'Invalid status' };
  const booking = await Booking.findOne({ where: { id: bookingId, driver_id: driverId } });
  if (!booking) throw { status: 404, message: 'Booking not found' };
  await booking.update({ status });
  await BookingStatusHistory.create({ booking_id: bookingId, status, changed_by: driverId });

  // Notify traveler of driver status transitions
  try {
    if (status === 'accepted') {
      await Notification.create({
        user_id: booking.traveler_id,
        title: 'Driver Accepted Ride',
        message: `Your driver has accepted your ride #${bookingId}.`
      });
    } else if (status === 'en_route') {
      await Notification.create({
        user_id: booking.traveler_id,
        title: 'Driver En Route',
        message: `Your driver is en route to your pickup location.`
      });
    } else if (status === 'arrived') {
      await Notification.create({
        user_id: booking.traveler_id,
        title: 'Driver Arrived',
        message: `Your driver has arrived at the pickup location.`
      });
    } else if (status === 'in_progress') {
      await Notification.create({
        user_id: booking.traveler_id,
        title: 'Trip Started',
        message: `Your ride #${bookingId} has started. Have a safe journey!`
      });
    } else if (status === 'completed') {
      await Notification.create({
        user_id: booking.traveler_id,
        title: 'Trip Completed',
        message: `Your ride #${bookingId} is complete. Please rate your driver!`
      });
    }
  } catch (notifyErr) {
    console.error('Failed to notify traveler of driver status update:', notifyErr);
  }

  if (status === 'rejected') {
    const driver = await User.findByPk(driverId);
    const driverName = driver ? driver.full_name : 'Driver';

    await booking.update({ driver_id: null, vehicle_id: null });

    const admins = await User.findAll({ where: { role: 'admin' } });
    for (const admin of admins) {
      await Notification.create({
        user_id: admin.id,
        title: 'Driver Rejected Booking',
        message: `Driver ${driverName} rejected the booking (${booking.booking_type}) from ${booking.pickup_location} to ${booking.dropoff_location}. Manual re-assignment is needed.`,
      });
    }

    try {
      await autoDispatch(bookingId);
    } catch (dispatchError) {
      console.error('Auto dispatch failed after rejection:', dispatchError);
    }
  }

  if (status === 'completed') {
    const pendingBooking = await Booking.findOne({
      where: {
        status: { [Op.in]: ['payment_verified', 'rejected'] },
        driver_id: null
      },
      order: [['created_at', 'ASC']]
    });
    if (pendingBooking) {
      try {
        await autoDispatch(pendingBooking.id);
      } catch (dispatchError) {
        console.error('Auto dispatch failed for pending booking on driver completion:', dispatchError);
      }
    }
  }

  return booking;
};

const getDriverTripHistory = async (driverId) =>
  Booking.findAll({
    where: { driver_id: driverId, status: { [Op.in]: ['completed', 'cancelled'] } },
    include: includes,
    order: [['updated_at', 'DESC']],
  });

const getDriverEarnings = async (driverId) => {
  const bookings = await Booking.findAll({ where: { driver_id: driverId, status: 'completed' } });
  const gross = bookings.reduce((sum, b) => sum + parseFloat(b.total_fare), 0);
  return { total_trips: bookings.length, gross_earnings: gross.toFixed(2), net_earnings: (gross * 0.8).toFixed(2) };
};

module.exports = {
  create, getMyBookings, getById, cancel, getAllAdmin,
  assignDriver, getDriverBookings, updateDriverStatus,
  getDriverTripHistory, getDriverEarnings, autoDispatch, estimate
};
