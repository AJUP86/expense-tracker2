const Contribution = require('../models/Contribution');
const Income = require('../models/Income');

exports.createContribution = async (userId, incomeId, data) => {
  const income = await Income.findOne({ _id: incomeId, userId });

  if (!income) throw new Error('Income not found');
  if (income.isClosed) throw new Error('Income is closed');

  if (!data.name || !data.amount || data.amount <= 0) {
    throw new Error('Invalid contribution data');
  }

  const contribution = await Contribution.create({
    userId,
    incomeId,
    name: data.name,
    amount: data.amount,
  });

  // Update income totals
  income.amount += data.amount;
  income.remaining += data.amount;
  await income.save();

  return contribution;
};

exports.getContributions = async (userId, incomeId) => {
  return Contribution.find({ userId, incomeId }).sort({ createdAt: -1 });
};
