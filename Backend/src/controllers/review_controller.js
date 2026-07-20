const reviewService = require('../services/review_service');
const { successResponse } = require('../utils/response');

const create = async (req, res, next) => {
  try {
    res
      .status(201)
      .json(successResponse('Review submitted', await reviewService.create(req.user.id, req.body)));
  } catch (e) {
    next(e);
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getTravelerReviews(req.user.id);
    res.json(successResponse('My reviews', reviews));
  } catch (e) {
    next(e);
  }
};

module.exports = { create, getMyReviews };
