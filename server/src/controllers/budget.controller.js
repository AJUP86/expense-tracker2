const budgetService = require('../services/budget.service');

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};
