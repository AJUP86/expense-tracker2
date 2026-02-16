const budgetService = require('../services/budget.service');
const { parsePaginationParams } = require('../utils/pagination');

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const filters = {
      periodId: req.query.periodId,
    };
    const paginationParams = parsePaginationParams(req.query);
    const result = await budgetService.getBudgets(
      req.user.id,
      filters,
      paginationParams,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
