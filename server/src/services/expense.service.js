const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Income = require('../models/Income');

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

  const income = await Income.findOne({ userId }).sort({ createdAt: -1 });

  if (!income) throw new Error('No income found for user');
  if (!income || income.remaining < amount) {
    throw new Error('Insufficient income remaining');
  }

  income.remaining -= amount;
  await income.save();

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

exports.getExpenses = async (userId) => {
  return Expense.find({ userId }).sort({ date: -1 });
};
