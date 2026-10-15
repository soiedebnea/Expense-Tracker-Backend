const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    color: { type: String, default: '#888888' },
  },
  { timestamps: true }
);
categorySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = model('Category', categorySchema);