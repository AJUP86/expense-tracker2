const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    remaining: {
      type: Number,
      default: 0,
    },

    name: {
      type: String,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
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
