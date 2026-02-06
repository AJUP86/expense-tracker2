const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoose = require('mongoose');

const app = express();

app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  res.json({
    ok: dbState === 1,
    database: dbStatus[dbState] || 'unknown',
  });
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/budgets', require('./routes/budget.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/periods', require('./routes/period.routes'));
app.use('/api/incomes', require('./routes/income.routes'));

// Error handler
app.use(require('./middlewares/error.middleware'));

module.exports = app;
