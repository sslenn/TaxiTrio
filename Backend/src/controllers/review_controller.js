const reviewService = require('../services/review_service');
const { successResponse } = require('../utils/response');

const create = async (req, res, next) => {
  try { res.status(201).json(successResponse('Review submitted', await reviewService.create(req.user.id, req.body))); }
  catch (e) { next(e); }
};

module.exports = { create };
