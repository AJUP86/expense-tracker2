const router = require('express').Router();
const controller = require('../controllers/income.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', controller.createIncome);
router.get('/', controller.getIncomes);
router.post('/:id/close', controller.closeIncome);

module.exports = router;
