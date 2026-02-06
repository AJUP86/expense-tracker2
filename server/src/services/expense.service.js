const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Period = require('../models/Period');

exports.createExpense = async (userId, data) => {
  const description = data?.description?.trim();
  const amount = Number(data?.amount);
  const budgetId = data?.budgetId;
  const paymentMethod = data?.paymentMethod;

  if (!description) {
    throw new Error('Description is required');
  }

  if (Number.isNaN(amount) || amount <= 0) {
    throw new Error('Amount must be a positive number');
  }

  if (!paymentMethod || !['cash', 'credit'].includes(paymentMethod)) {
    throw new Error('Invalid payment method');
  }

  const activePeriod = await Period.findOne({
    userId,
    status: 'ACTIVE',
  });

  if (!activePeriod) {
    throw new Error(
      'No ACTIVE period found. Activate a period before adding expenses.',
    );
  }

  if (budgetId) {
    const budget = await Budget.findOne({
      _id: budgetId,
      userId,
      periodId: activePeriod._id,
    });

    if (!budget) {
      throw new Error('Budget not found for the active period');
    }

    // Use transaction for atomic budget update + expense creation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      budget.remaining -= amount;
      await budget.save({ session });

      const [expense] = await Expense.create(
        [
          {
            userId,
            periodId: activePeriod._id,
            description,
            amount,
            budgetId,
            paymentMethod,
            date: data?.date || new Date(),
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return expense;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // No budget — no transaction needed
  const expense = await Expense.create({
    userId,
    periodId: activePeriod._id,
    description,
    amount,
    paymentMethod,
    date: data?.date || new Date(),
  });

  return expense;
};

exports.getExpenses = async (userId, filters = {}) => {
  const query = { userId };

  if (filters.periodId) {
    query.periodId = filters.periodId;
  }

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
