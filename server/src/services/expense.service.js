const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Income = require('../models/Income');

exports.createExpense = async (userId, data) => {
  let budget = null;

  if (data.budgetId) {
    budget = await Budget.findOne({ _id: data.budgetId, userId });
    if (!budget) throw new Error('Budget not found');

    const now = new Date();
    if (
      budget.type === 'temporary' &&
      (now < budget.startDate || now > budget.endDate)
    ) {
      throw new Error('Budget is not active');
    }

    if (budget.remaining < data.amount) throw new Error('Budget exceeded');
  }

  const latestIncome = await Income.findOne({ userId }).sort({ date: -1 });
  if (!latestIncome) throw new Error('No income found for user');
  if (latestIncome.remaining < data.amount)
    throw new Error('Not enough remaining income');

  if (budget) {
    budget.remaining -= data.amount;
    await budget.save();
  }

  latestIncome.remaining -= data.amount;
  if (latestIncome.remaining < 0) latestIncome.remaining = 0;
  await latestIncome.save();

  const expense = await Expense.create({
    userId,
    budgetId: data.budgetId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    description: data.description,
    date: data.date,
  });

  return expense;
};

exports.getExpenses = async (userId) => {
  return Expense.find({ userId }).sort({ date: -1 });
};
