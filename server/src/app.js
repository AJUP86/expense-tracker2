const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/budgets', require('./routes/budget.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
//app.use('/api/incomes', require('./routes/income.routes'));

// Error handler (always last)
app.use(require('./middlewares/error.middleware'));

module.exports = app;
