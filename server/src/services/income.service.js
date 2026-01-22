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

exports.closeIncome = async (userId, incomeId) => {
  const income = await Income.findOne({ _id: incomeId, userId });

  if (!income) throw new Error('Income not found');
  if (income.isClosed) throw new Error('Income already closed');

  income.isClosed = true;
  await income.save();

  return income;
};
