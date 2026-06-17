const routeService = require('../services/route_service');
const { successResponse } = require('../utils/response');

const getAll = async (req, res, next) => {
  try { res.json(successResponse('Routes fetched', await routeService.getAll())); }
  catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(successResponse('Route created', await routeService.create(req.body))); }
  catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try { res.json(successResponse('Route updated', await routeService.update(req.params.id, req.body))); }
  catch (e) { next(e); }
};

module.exports = { getAll, create, update };
