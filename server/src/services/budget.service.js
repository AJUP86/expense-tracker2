const Budget = require('../models/Budget');
const Period = require('../models/Period');

exports.createBudget = async (userId, data) => {
  const budgetName = data?.name?.trim();
  const budgetAmount = Number(data?.amount);
  const budgetType = data?.type || 'fixed';

  if (!budgetName) throw new Error('Name is required');
  if (Number.isNaN(budgetAmount) || budgetAmount <= 0) {
    throw new Error('Amount must be a positive number');
  }
  if (!['fixed', 'variable'].includes(budgetType)) {
    throw new Error('Invalid budget type');
  }

  const planningPeriod = await Period.findOne({
    userId,
    status: 'PLANNING',
  });

  if (!planningPeriod) {
    throw new Error(
      'No PLANNING period found. Create a period before adding budgets.',
    );
  }

  return Budget.create({
    userId,
    periodId: planningPeriod._id,
    name: budgetName,
    amount: budgetAmount,
    remaining: budgetAmount,
    type: budgetType,
  });
};

exports.getBudgets = async (userId, filters = {}) => {
  const query = { userId };

  if (filters.periodId) {
    query.periodId = filters.periodId;
  } else {
    const currentPeriod = await Period.findOne({
      userId,
      status: { $in: ['PLANNING', 'ACTIVE'] },
    }).sort({ startDate: -1, createdAt: -1 });

    if (currentPeriod) {
      query.periodId = currentPeriod._id;
    } else {
      return [];
    }
  }

  return Budget.find(query).sort({ createdAt: -1 });
};
