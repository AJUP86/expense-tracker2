const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    remaining: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ['monthly', 'fixed', 'temporary'],
      default: 'monthly',
    },

    startDate: Date,
    endDate: Date,
  },
  { timestamps: true },
);

budgetSchema.index({ userId: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
