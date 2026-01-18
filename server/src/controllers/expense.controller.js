const expenseService = require('../services/expense.service');

// Create a new expense
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
      budgetId: req.query.budgetId,
      category: req.query.category,
      startDate: req.query.startDate
        ? new Date(req.query.startDate)
        : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
    };
    const expenses = await expenseService.getExpenses(req.user.id, filters);
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};
