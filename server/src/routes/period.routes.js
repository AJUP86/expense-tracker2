const router = require('express').Router();
const controller = require('../controllers/period.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', controller.createPeriod);
router.get('/', controller.getPeriods);
router.get('/current', controller.getCurrentPeriod);
router.post('/:id/activate', controller.activatePeriod);
router.post('/:id/archive', controller.archivePeriod);
router.post('/rollover', controller.rolloverPeriod);

module.exports = router;
