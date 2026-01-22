const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/contribution.controller');

router.use(auth);

router.post('/:incomeId', controller.createContribution);
router.get('/:incomeId', controller.getContributions);

module.exports = router;
