const incomeService = require('../services/income.service');

exports.createIncome = async (req, res, next) => {
  try {
    const income = await incomeService.createIncome(req.user.id, req.body);
    res.status(201).json(income);
  } catch (err) {
    next(err);
  }
};

exports.getIncomes = async (req, res, next) => {
  try {
    const incomes = await incomeService.getIncomes(req.user.id);
    res.json(incomes);
  } catch (err) {
    next(err);
  }
};

exports.closeIncome = async (req, res, next) => {
  try {
    const income = await incomeService.closeIncome(req.user.id, req.params.id);
    res.json(income);
  } catch (err) {
    next(err);
  }
};
