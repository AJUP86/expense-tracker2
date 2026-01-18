const router = require('express').Router();
const controller = require('../controllers/expense.controller');
const auth = require('../middlewares/auth.middleware');

// Protect all expense routes
router.use(auth);

router.post('/', controller.createExpense);
router.get('/', controller.getExpenses);

module.exports = router;
