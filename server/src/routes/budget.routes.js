const router = require('express').Router();
const controller = require('../controllers/budget.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, controller.createBudget);

module.exports = router;
