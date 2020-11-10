const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/httpControllers/checkInController');

router.get('/', checkInController.getAll);

router.get('/_id/:_id/', checkInController.getById);

router.get('/room_id/:room_id/', checkInController.getByRoomId);

router.get('/date/:date1/:date2/', checkInController.getByDateRange);

router.get('/status/:status/', checkInController.getByStatus);

router.get('/active/', checkInController.metrics.getActiveCheckIns);

router.post('/new/', checkInController.new);

module.exports = router;
