const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    periodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Period',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    remaining: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ['fixed', 'variable'],
      default: 'fixed',
    },
  },
  { timestamps: true },
);

budgetSchema.index({ userId: 1, periodId: 1, createdAt: -1 });
budgetSchema.index({ userId: 1, periodId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
