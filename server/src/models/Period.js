const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PLANNING', 'ACTIVE', 'ARCHIVED'],
      required: true,
      default: 'PLANNING',
      index: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

periodSchema.index({ userId: 1, startDate: -1 });

module.exports = mongoose.model('Period', periodSchema);
