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

router.get('/day/:days', waterConsumptionController.getConsumptionByDay);

router.get('/day/:lastDate/:days', waterConsumptionController.getConsumptionByDaySince);

router.get('/hour/:date/', waterConsumptionController.getConsumptionByHour);

router.get('/room/', waterConsumptionController.getConsumptionByRoom);

router.get('/room/:state/', waterConsumptionController.getConsumptionByRoom);

router.get('/current/room/', waterConsumptionController.getCurrentConsumptionByRoom);

router.get('/expected/:expected/', waterConsumptionController.getByExpectedState);

router.get('/total/', waterConsumptionController.metrics.getTotalConsumption);

module.exports = router;