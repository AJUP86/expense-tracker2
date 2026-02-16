const expenseService = require('../services/expense.service');
const { parsePaginationParams } = require('../utils/pagination');

exports.createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user.id, req.body);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const filters = {
      periodId: req.query.periodId,
      budgetId: req.query.budgetId,
      startDate: req.query.startDate
        ? new Date(req.query.startDate)
        : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
    };
    const paginationParams = parsePaginationParams(req.query);
    const result = await expenseService.getExpenses(
      req.user.id,
      filters,
      paginationParams,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
