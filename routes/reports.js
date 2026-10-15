const router = require('express').Router();
const Transaction = require('../models/Transaction');
const { monthRange } = require('../utils/range');

// GET /api/reports/monthly?month=2026-09
// -> { income, expense, balance, byCategory: [{type,name,color,total}] }
router.get('/monthly', async (req, res) => {
  const { start, end } = monthRange(req.query.month);
  const match = { date: { $gte: start, $lt: end } };

  const [totals, byCategory] = await Promise.all([
    Transaction.aggregate([{ $match: match }, { $group: { _id: '$type', total: { $sum: '$amount' } } }]),
    Transaction.aggregate([
      { $match: match },
      { $group: { _id: { type: '$type', category: '$category' }, total: { $sum: '$amount' } } },
      { $lookup: { from: 'categories', localField: '_id.category', foreignField: '_id', as: 'c' } },
      { $unwind: '$c' },
      { $project: { _id: 0, type: '$_id.type', name: '$c.name', color: '$c.color', total: 1 } },
      { $sort: { total: -1 } },
    ]),
  ]);

  const income = totals.find((t) => t._id === 'income')?.total || 0;
  const expense = totals.find((t) => t._id === 'expense')?.total || 0;
  res.json({ income, expense, balance: income - expense, byCategory });
});

// GET /api/reports/yearly?year=2026
// -> [{ month: 1..12, income, expense }]
router.get('/yearly', async (req, res) => {
  const year = parseInt(req.query.year, 10);
  if (!year) return res.status(400).json({ message: 'year is required' });
  const rows = await Transaction.aggregate([
    { $match: { date: { $gte: new Date(Date.UTC(year, 0, 1)), $lt: new Date(Date.UTC(year + 1, 0, 1)) } } },
    { $group: { _id: { m: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
  ]);
  const out = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expense: 0 }));
  rows.forEach((r) => { out[r._id.m - 1][r._id.type] = r.total; });
  res.json(out);
});

module.exports = router;