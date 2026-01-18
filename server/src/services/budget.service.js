const Budget = require('../models/Budget');

exports.createBudget = async (userId, data) => {
  if (!data.name || !data.amount)
    throw new Error('Name and amount are required');

  if (data.type === 'temporary') {
    if (!data.startDate || !data.endDate) {
      throw new Error('Temporary budgets require start and end dates');
    }
  }
  return Budget.create({
    userId,
    name: data.name,
    amount: data.amount,
    remaining: data.amount,
    type: data.type || 'monthly',
    startDate: data.startDate,
    endDate: data.endDate,
  });
};

exports.getBudgets = async (userId) => {
  return Budget.find({ userId }).sort({ createdAt: -1 });
};
