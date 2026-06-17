const bookingService = require('../services/booking_service');
const { successResponse } = require('../utils/response');

const estimate = async (req, res, next) => {
  try {
    const data = await bookingService.estimate(req.body);
    res.json(successResponse('Fare estimation completed', data));
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const data = await bookingService.create(req.user.id, req.body);
    try {
      const { User } = require('../../models');
      const user = await User.findByPk(req.user.id);
      const travelerName = user ? user.full_name : 'Unknown Traveler';

      const { sendTelegramAlert } = require('../utils/telegram');
      sendTelegramAlert(
        `🚗 <b>New Ride Booking!</b>\n\n` +
        `<b>Booking ID:</b> #${data.id || 'N/A'}\n` +
        `<b>Traveler:</b> ${travelerName}\n` +
        `<b>Type:</b> <i>${req.body.booking_type || 'city_ride'}</i>\n` +
        `<b>Pickup:</b> ${req.body.pickup_location}\n` +
        `<b>Dropoff:</b> ${req.body.dropoff_location}\n` +
        `<b>Total Fare:</b> $${data.total_fare || req.body.total_fare || '0.00'}`
      );
    } catch (err) {
      console.error('Failed to trigger Telegram notification:', err);
    }
    res.status(201).json(successResponse('Booking created', data));
  }
  catch (e) { next(e); }
};

const getMyBookings = async (req, res, next) => {
  try { res.json(successResponse('Bookings fetched', await bookingService.getMyBookings(req.user.id))); }
  catch (e) { next(e); }
};

const getById = async (req, res, next) => {
  try { res.json(successResponse('Booking fetched', await bookingService.getById(req.params.id, req.user.id, req.user.role))); }
  catch (e) { next(e); }
};

const cancel = async (req, res, next) => {
  try { res.json(successResponse('Booking cancelled', await bookingService.cancel(req.params.id, req.user.id))); }
  catch (e) { next(e); }
};

const getAllAdmin = async (req, res, next) => {
  try { res.json(successResponse('All bookings', await bookingService.getAllAdmin())); }
  catch (e) { next(e); }
};

const assignDriver = async (req, res, next) => {
  try {
    const { driver_id, vehicle_id } = req.body;
    res.json(successResponse('Driver assigned', await bookingService.assignDriver(req.params.id, driver_id, vehicle_id)));
  } catch (e) { next(e); }
};

const getDriverBookings = async (req, res, next) => {
  try { res.json(successResponse('Driver bookings', await bookingService.getDriverBookings(req.user.id))); }
  catch (e) { next(e); }
};

const updateDriverStatus = async (req, res, next) => {
  try {
    res.json(successResponse('Status updated', await bookingService.updateDriverStatus(req.params.id, req.user.id, req.body.status)));
  } catch (e) { next(e); }
};

const getDriverTripHistory = async (req, res, next) => {
  try { res.json(successResponse('Trip history', await bookingService.getDriverTripHistory(req.user.id))); }
  catch (e) { next(e); }
};

const getDriverEarnings = async (req, res, next) => {
  try { res.json(successResponse('Earnings', await bookingService.getDriverEarnings(req.user.id))); }
  catch (e) { next(e); }
};

module.exports = {
  create, getMyBookings, getById, cancel, getAllAdmin,
  assignDriver, getDriverBookings, updateDriverStatus,
  getDriverTripHistory, getDriverEarnings, estimate
};
