const Period = require('../models/Period');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { paginateQuery } = require('../utils/pagination');

function validateDateRange(startDate, endDate) {
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (
    Number.isNaN(parsedStartDate.getTime()) ||
    Number.isNaN(parsedEndDate.getTime())
  ) {
    throw new Error('Invalid startDate or endDate');
  }

  if (parsedStartDate >= parsedEndDate) {
    throw new Error('endDate must be after startDate');
  }

  return { parsedStartDate, parsedEndDate };
}

exports.createPeriod = async (userId, data) => {
  if (!data?.name || data.name.trim() === '') {
    throw new Error('Period should have a name');
  }

  if (!data?.endDate) {
    throw new Error('Period must have an endDate');
  }

  const startDate = data.startDate || new Date();
  const { parsedStartDate, parsedEndDate } = validateDateRange(
    startDate,
    data.endDate,
  );

  const existingCurrentPeriod = await Period.findOne({
    userId,
    status: { $in: ['PLANNING', 'ACTIVE'] },
  });

  if (existingCurrentPeriod) {
    throw new Error(
      'A current period already exists. Archive it before creating a new one.',
    );
  }

  return Period.create({
    userId,
    name: data.name.trim(),
    status: 'PLANNING',
    startDate: parsedStartDate,
    endDate: parsedEndDate,
  });
};

exports.getPeriods = async (userId, paginationParams = null) => {
  const query = { userId };

  if (paginationParams) {
    return paginateQuery(Period, query, paginationParams, {
      sort: { startDate: -1, createdAt: -1 },
    });
  }

  return Period.find(query).sort({ startDate: -1, createdAt: -1 });
};

exports.getCurrentPeriod = async (userId) => {
  return Period.findOne({
    userId,
    status: { $in: ['PLANNING', 'ACTIVE'] },
  }).sort({ startDate: -1, createdAt: -1 });
};

exports.activatePeriod = async (userId, periodId) => {
  const period = await Period.findOne({ _id: periodId, userId });

  if (!period) {
    throw new Error('Period not found');
  }

  if (period.status === 'ARCHIVED') {
    throw new Error('Cannot activate an archived period');
  }

  if (period.status === 'ACTIVE') {
    return period; // idempotent
  }

  const otherActivePeriod = await Period.findOne({
    userId,
    status: 'ACTIVE',
    _id: { $ne: periodId },
  });

  if (otherActivePeriod) {
    throw new Error(
      'Another active period already exists. Archive it before activating this one.',
    );
  }

  period.status = 'ACTIVE';
  await period.save();

  return period;
};

exports.archivePeriod = async (userId, periodId) => {
  const period = await Period.findOne({ _id: periodId, userId });

  if (!period) {
    throw new Error('Period not found');
  }

  if (period.status === 'ARCHIVED') {
    return period; // idempotent
  }

  if (period.status !== 'ACTIVE') {
    throw new Error('Only an ACTIVE period can be archived');
  }

  period.status = 'ARCHIVED';
  await period.save();

  return period;
};

exports.rolloverPeriod = async (userId, data) => {
  const activePeriod = await Period.findOne({
    userId,
    status: 'ACTIVE',
  });

  if (activePeriod) {
    activePeriod.status = 'ARCHIVED';
    await activePeriod.save();
  }

  return exports.createPeriod(userId, data);
};

exports.getPeriodSummary = async (userId, periodId) => {
  const incomes = await Income.find({ userId, periodId });
  const expenses = await Expense.find({ userId, periodId });

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const remainingIncome = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    remainingIncome,
  };
};
