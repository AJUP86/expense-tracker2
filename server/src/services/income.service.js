const Income = require('../models/Income');
const Period = require('../models/Period');

exports.createIncome = async (userId, periodId, data) => {
  const period = await Period.findOne({ _id: periodId, userId });

  if (!period) throw new Error('Period not found');

  if (period.status !== 'PLANNING') {
    throw new Error('Income can only be added while the period is in PLANNING');
  }

  const incomeName = data?.name?.trim();
  const incomeAmount = Number(data?.amount);

  if (!incomeName || Number.isNaN(incomeAmount) || incomeAmount <= 0) {
    throw new Error('Invalid income');
  }

  const income = await Income.create({
    userId,
    periodId,
    name: incomeName,
    amount: incomeAmount,
  });

  return income;
};

exports.getIncomes = async (userId, periodId) => {
  const period = await Period.findOne({ _id: periodId, userId });
  if (!period) throw new Error('Period not found');

  return Income.find({ userId, periodId }).sort({ createdAt: -1 });
};
