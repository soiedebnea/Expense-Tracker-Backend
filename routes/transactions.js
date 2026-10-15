const router = require('express').Router();
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { monthRange } = require('../utils/range');

// Make sure the category exists and matches the transaction type
async function checkCategory(type, categoryId) {
  const cat = await Category.findById(categoryId);
  if (!cat || cat.type !== type) {
    const err = new Error('Category not found or does not match type');
    err.status = 400;
    throw err;
  }
}

// GET /api/transactions?month=2026-09&type=expense&category=<id>
router.get('/', async (req, res) => {
  const { month, type, category } = req.query;
  const filter = {};
  if (month) { const { start, end } = monthRange(month); filter.date = { $gte: start, $lt: end }; }
  if (type) filter.type = type;
  if (category) filter.category = category;
  res.json(await Transaction.find(filter).populate('category', 'name color').sort({ date: -1, createdAt: -1 }));
});

router.post('/', async (req, res) => {
  const { type, amount, category, note, date } = req.body;
  await checkCategory(type, category);
  const doc = await Transaction.create({ type, amount, category, note, date });
  res.status(201).json(await doc.populate('category', 'name color'));
});

router.put('/:id', async (req, res) => {
  const { type, amount, category, note, date } = req.body;
  await checkCategory(type, category);
  const doc = await Transaction.findByIdAndUpdate(
    req.params.id,
    { type, amount, category, note, date },
    { new: true, runValidators: true }
  ).populate('category', 'name color');
  if (!doc) return res.status(404).json({ message: 'Transaction not found' });
  res.json(doc);
});

router.delete('/:id', async (req, res) => {
  const doc = await Transaction.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;