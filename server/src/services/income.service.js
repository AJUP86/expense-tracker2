const Income = require('../models/Income');
const Period = require('../models/Period');

exports.createIncome = async (userId, periodId, data) => {
  const period = await Period.findOne({ _id: periodId, userId });

  if (!period) throw new Error('Period not found');
  if (period.isClosed) throw new Error('Period is closed');

  if (!data.name || !data.amount || data.amount <= 0) {
    throw new Error('Invalid income');
  }

  const income = await Income.create({
    userId,
    periodId,
    name: data.name,
    amount: data.amount,
  });

  // Update period totals
  period.amount = (period.amount || 0) + data.amount;
  period.remaining = (period.remaining || 0) + data.amount;
  await period.save();

  return income;
};

exports.getIncomes = async (userId, periodId) => {
  return Income.find({ userId, periodId }).sort({ createdAt: -1 });
};
