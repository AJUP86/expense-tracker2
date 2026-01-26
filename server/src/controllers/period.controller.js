const periodService = require('../services/period.service');

exports.createPeriod = async (req, res, next) => {
  try {
    const period = await periodService.createPeriod(req.user.id, req.body);
    res.status(201).json(period);
  } catch (err) {
    next(err);
  }
};

exports.getPeriods = async (req, res, next) => {
  try {
    const periods = await periodService.getPeriods(req.user.id);
    res.json(periods);
  } catch (err) {
    next(err);
  }
};

exports.closePeriod = async (req, res, next) => {
  try {
    const period = await periodService.closePeriod(req.user.id, req.params.id);
    res.json(period);
  } catch (err) {
    next(err);
  }
};
