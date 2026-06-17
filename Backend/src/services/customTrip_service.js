const { CustomTripRequest, User, Notification } = require('../../models');

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
  if (req.telegram_contact || req.traveler_response) {
    throw { status: 400, message: 'Details have already been confirmed for this trip request.' };
  }
  await req.update({ traveler_response, telegram_contact, origin, destination, travel_date, travel_time });
  return req;
};

const markUrgent = async (id, travelerId) => {
  const req = await CustomTripRequest.findOne({ where: { id, traveler_id: travelerId } });
  if (!req) throw { status: 404, message: 'Request not found' };
  return req;
};

module.exports = { create, getAll, updateStatus, getMyRequests, confirmRequest, markUrgent };

