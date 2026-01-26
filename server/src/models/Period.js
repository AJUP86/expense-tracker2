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
      required: false,
    },
    remaining: { type: Number, required: false },
    name: {
      type: String,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

periodSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Period', periodSchema);
