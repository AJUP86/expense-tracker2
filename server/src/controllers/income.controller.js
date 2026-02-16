const incomeService = require('../services/income.service');
const { parsePaginationParams } = require('../utils/pagination');

exports.createIncome = async (req, res, next) => {
  try {
    const income = await incomeService.createIncome(
      req.user.id,
      req.params.periodId,
      req.body,
    );
    res.status(201).json(income);
  } catch (err) {
    next(err);
  }
};

exports.getIncomes = async (req, res, next) => {
  try {
    const paginationParams = parsePaginationParams(req.query);
    const result = await incomeService.getIncomes(
      req.user.id,
      req.params.periodId,
      paginationParams,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
