const service = require('../services/contribution.service');

exports.createContribution = async (req, res, next) => {
  try {
    const contribution = await service.createContribution(
      req.user.id,
      req.params.incomeId,
      req.body,
    );
    res.status(201).json(contribution);
  } catch (err) {
    next(err);
  }
};

exports.getContributions = async (req, res, next) => {
  try {
    const contributions = await service.getContributions(
      req.user.id,
      req.params.incomeId,
    );
    res.json(contributions);
  } catch (err) {
    next(err);
  }
};
