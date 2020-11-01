const express = require('express');
const router = express.Router();
const waterConsumptionController = require('../controllers/httpControllers/waterConsumptionController');

router.get('/', waterConsumptionController.getAll);

router.get('/_id/:_id/', waterConsumptionController.getById);

router.get('/sensor/:sensor_name/', waterConsumptionController.getBySensorName);

router.get('/total/room/:room_id/date/:date1/:date2/', waterConsumptionController.getTotalByRoomAndDate);

router.get('/date/:date1/:date2/', waterConsumptionController.getByDateRange);

router.get('/guest/', waterConsumptionController.getConsumptionForAllGuests);

router.get('/day/', waterConsumptionController.getConsumptionByDay);

router.get('/hour/:date/', waterConsumptionController.getConsumptionByHour);

module.exports = router;