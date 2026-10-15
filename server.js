require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Category = require('./models/Category');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/categories', require('./routes/categories'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/reports', require('./routes/reports'));

// Central error handler (Express 5 forwards async errors here automatically)
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ message: 'Already exists' });
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function seedCategories() {
  if (await Category.countDocuments()) return;
  await Category.insertMany([
    { name: 'Salary', type: 'income', color: '#1F7A5A' },
    { name: 'Freelance', type: 'income', color: '#3E9C7A' },
    { name: 'Food', type: 'expense', color: '#C2493D' },
    { name: 'Transport', type: 'expense', color: '#D9902F' },
    { name: 'Rent', type: 'expense', color: '#5B5F97' },
    { name: 'Bills', type: 'expense', color: '#2B6E8F' },
  ]);
}

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(seedCategories)
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });