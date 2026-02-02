const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Global middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/budgets', require('./routes/budget.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/periods', require('./routes/period.routes'));
app.use('/api/incomes', require('./routes/income.routes'));

// Error handler (always last)
app.use(require('./middlewares/error.middleware'));

module.exports = app;
