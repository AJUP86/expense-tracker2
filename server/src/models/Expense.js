const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    periodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Period',
      required: true,
      index: true,
    },

    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'credit'],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

expenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
