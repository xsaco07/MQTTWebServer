const express = require('express');
const router = express.Router();
const checkOutController = require('../controllers/httpControllers/checkOutController');

router.get('/', checkOutController.getAll);

router.get('/_id/:_id/', checkOutController.getById);

router.get('/checkIn_id/:checkIn_id/', checkOutController.getByCheckInId);

router.get('/date/:date1/:date2', checkOutController.getByDateRange);

router.post('/new/', checkOutController.new);

module.exports = router;
