const periodService = require('../services/period.service');
const { parsePaginationParams } = require('../utils/pagination');

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
    const paginationParams = parsePaginationParams(req.query);
    const result = await periodService.getPeriods(
      req.user.id,
      paginationParams,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getCurrentPeriod = async (req, res, next) => {
  try {
    const currentPeriod = await periodService.getCurrentPeriod(req.user.id);

    if (!currentPeriod) {
      return res.json(null);
    }

    const summary = await periodService.getPeriodSummary(
      req.user.id,
      currentPeriod._id,
    );

    res.json({
      ...currentPeriod.toObject(),
      summary,
    });
  } catch (err) {
    next(err);
  }
};

exports.activatePeriod = async (req, res, next) => {
  try {
    const period = await periodService.activatePeriod(
      req.user.id,
      req.params.id,
    );
    res.json(period);
  } catch (err) {
    next(err);
  }
};

exports.archivePeriod = async (req, res, next) => {
  try {
    const period = await periodService.archivePeriod(
      req.user.id,
      req.params.id,
    );
    res.json(period);
  } catch (err) {
    next(err);
  }
};

exports.rolloverPeriod = async (req, res, next) => {
  try {
    const newPeriod = await periodService.rolloverPeriod(req.user.id, req.body);
    res.status(201).json(newPeriod);
  } catch (err) {
    next(err);
  }
};
