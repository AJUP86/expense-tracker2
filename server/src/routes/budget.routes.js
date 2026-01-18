const router = require('express').Router();
const controller = require('../controllers/budget.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', controller.createBudget);
router.get('/', controller.getBudgets);

module.exports = router;
