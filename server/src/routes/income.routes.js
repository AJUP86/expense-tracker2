const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/income.controller');

router.use(auth);

router.post('/:periodId', controller.createIncome);
router.get('/:periodId', controller.getIncomes);

module.exports = router;
