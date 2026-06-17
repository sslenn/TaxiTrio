const packageService = require('../services/package_service');
const { successResponse } = require('../utils/response');

const getAll = async (req, res, next) => {
  try { res.json(successResponse('Packages fetched', await packageService.getAll())); }
  catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(successResponse('Package created', await packageService.create(req.body))); }
  catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try { res.json(successResponse('Package updated', await packageService.update(req.params.id, req.body))); }
  catch (e) { next(e); }
};

const getById = async (req, res, next) => {
  try { res.json(successResponse('Package fetched', await packageService.getById(req.params.id))); }
  catch (e) { next(e); }
};

module.exports = { getAll, create, update, getById };
