const Period = require('../models/Period');

exports.createPeriod = async (userId, data) => {
  if (!data.name || data.name.trim() === '') {
    throw new Error('Period should have a name');
  }

  return Period.create({
    userId,
    amount: data.amount ?? 0,
    remaining: data.amount ?? 0,
    name: data.name,
    date: data.date,
  });
};

exports.getPeriods = async (userId) => {
  return Period.find({ userId }).sort({ date: -1 });
};

exports.closePeriod = async (userId, periodId) => {
  const period = await Period.findOne({ _id: periodId, userId });

  if (!period) throw new Error('Period not found');
  if (period.isClosed) throw new Error('Period already closed');

  period.isClosed = true;
  await period.save();

  return period;
};
