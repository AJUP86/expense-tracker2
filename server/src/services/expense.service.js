const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Period = require('../models/Period');

exports.createExpense = async (userId, data) => {
  const { description, amount, budgetId } = data;

  if (!description || !amount) {
    throw new Error('Description and amount are required');
  }

  if (budgetId) {
    const budget = await Budget.findOne({ _id: budgetId, userId });
    if (!budget) throw new Error('Budget not found');

    if (budget.remaining < amount) {
      throw new Error('Budget has insufficient remaining amount');
    }

    const now = new Date();
    if (
      budget.type === 'temporary' &&
      (now < budget.startDate || now > budget.endDate)
    ) {
      throw new Error('Budget is not active');
    }

    budget.remaining -= amount;
    await budget.save();
  }

  const period = await Period.findOne({ userId, isClosed: true }).sort({
    createdAt: -1,
  });

  if (!period) throw new Error('No period found for user');
  if (!period || period.remaining < amount) {
    throw new Error('Insufficient funds remaining');
  }

  period.remaining -= amount;
  await period.save();

  const expense = await Expense.create({
    userId,
    description,
    amount,
    budgetId,
    paymentMethod: data.paymentMethod,
    date: data.date,
  });

  return expense;
};

exports.getExpenses = async (userId, filters = {}) => {
  const query = { userId };

  if (filters.budgetId) {
    query.budgetId = filters.budgetId;
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = filters.startDate;
    if (filters.endDate) query.date.$lte = filters.endDate;
  }

  return Expense.find(query).sort({ date: -1 }).populate('budgetId', 'name');
};
