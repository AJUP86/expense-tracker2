const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

exports.createExpense = async (userId, data) => {
  let budget = null;

  if (data.budgetId) {
    budget = await Budget.findOne({
      _id: data.budgetId,
      userId,
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    // Check temporary budget validity
    const now = new Date();
    if (budget.type === 'temporary') {
      if (now < budget.startDate || now > budget.endDate) {
        throw new Error('Budget is not active');
      }
    }

    if (budget.remaining < data.amount) {
      throw new Error('Budget exceeded');
    }

    budget.remaining -= data.amount;
    await budget.save();
  }

  return Expense.create({
    userId,
    budgetId: data.budgetId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    description: data.description,
    date: data.date,
  });
};
