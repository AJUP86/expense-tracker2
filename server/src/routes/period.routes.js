const router = require('express').Router();
const controller = require('../controllers/period.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', controller.createPeriod);
router.get('/', controller.getPeriods);
router.post('/:id/close', controller.closePeriod);

module.exports = router;
