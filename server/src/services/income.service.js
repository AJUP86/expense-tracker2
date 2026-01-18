const Income = require('../models/Income');

exports.createIncome = async (userId, data) => {
  if (data.amount <= 0) {
    throw new Error('Income must be positive');
  }

  return Income.create({
    userId,
    amount: data.amount,
    remaining: data.amount,
    source: data.source,
    date: data.date,
  });
};

exports.getIncomes = async (userId) => {
  return Income.find({ userId }).sort({ date: -1 });
};
