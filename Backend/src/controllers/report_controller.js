const reportService = require('../services/report_service');
const { successResponse } = require('../utils/response');

const getStats = async (req, res, next) => {
  try { res.json(successResponse('Report data', await reportService.getStats())); }
  catch (e) { next(e); }
};

module.exports = { getStats };
