const { Schema, model } = require('mongoose');

const transactionSchema = new Schema(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: [0.01, 'Amount must be greater than 0'] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    note: { type: String, trim: true, maxlength: 200, default: '' },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);
transactionSchema.index({ date: -1 });

module.exports = model('Transaction', transactionSchema);