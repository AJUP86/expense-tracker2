const Contribution = require('../models/Contribution');
const Period = require('../models/Period');

exports.createContribution = async (userId, periodId, data) => {
  const period = await Period.findOne({ _id: periodId, userId });

  if (!period) throw new Error('Period not found');
  if (period.isClosed) throw new Error('Period is closed');

  if (!data.name || !data.amount || data.amount <= 0) {
    throw new Error('Invalid contribution data');
  }

  const contribution = await Contribution.create({
    userId,
    periodId,
    name: data.name,
    amount: data.amount,
  });

  // Update income totals
  period.amount += data.amount;
  period.remaining += data.amount;
  await period.save();

  return contribution;
};

exports.getContributions = async (userId, periodId) => {
  return Contribution.find({ userId, periodId }).sort({ createdAt: -1 });
};
