const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    incomeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Income',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

contributionSchema.index({ userId: 1, incomeId: 1 });

module.exports = mongoose.model('Contribution', contributionSchema);
