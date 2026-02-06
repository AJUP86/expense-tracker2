const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security headers (helmet)
app.use(helmet());

// Rate limiter for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per windowMs
  message: { message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

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
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/budgets', require('./routes/budget.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/periods', require('./routes/period.routes'));
app.use('/api/incomes', require('./routes/income.routes'));

// Error handler (always last)
app.use(require('./middlewares/error.middleware'));

module.exports = app;
