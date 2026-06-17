const vehicleService = require('../services/vehicle_service');
const { successResponse } = require('../utils/response');

const getAll = async (req, res, next) => {
  try { res.json(successResponse('Vehicles fetched', await vehicleService.getAll())); }
  catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(successResponse('Vehicle created', await vehicleService.create(req.body))); }
  catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try { res.json(successResponse('Vehicle updated', await vehicleService.update(req.params.id, req.body))); }
  catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await vehicleService.remove(req.params.id);
    res.json(successResponse('Vehicle deleted'));
  } catch (e) { next(e); }
};

module.exports = { getAll, create, update, remove };
