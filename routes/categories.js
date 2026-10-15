const router = require('express').Router();
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  res.json(await Category.find().sort({ type: 1, name: 1 }));
});

router.post('/', async (req, res) => {
  const { name, type, color } = req.body;
  res.status(201).json(await Category.create({ name, type, color }));
});

router.put('/:id', async (req, res) => {
  const { name, color } = req.body; // type is fixed once created
  const doc = await Category.findByIdAndUpdate(
    req.params.id,
    { name, color },
    { new: true, runValidators: true }
  );
  if (!doc) return res.status(404).json({ message: 'Category not found' });
  res.json(doc);
});

router.delete('/:id', async (req, res) => {
  if (await Transaction.exists({ category: req.params.id }))
    return res.status(409).json({ message: 'Category is used by transactions' });
  const doc = await Category.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;