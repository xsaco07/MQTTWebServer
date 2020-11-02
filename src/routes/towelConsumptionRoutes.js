const express = require('express');
const router = express.Router();
const towelConsumptionController = require('../controllers/httpControllers/towelConsumptionController');

router.get('/', towelConsumptionController.getAll);

router.get('/_id/:_id/', towelConsumptionController.getById);

router.get('/sensor/:sensor_name/', towelConsumptionController.getBySensorName);

router.get('/total/room/:room_id/date/:date1/:date2/', towelConsumptionController.getTotalByRoomAndDate);

router.get('/date/:date1/:date2/', towelConsumptionController.getByDateRange);

router.get('/guest/', towelConsumptionController.getConsumptionForAllGuests);

router.get('/day/', towelConsumptionController.getConsumptionByDay);

router.get('/hour/:date/', towelConsumptionController.getConsumptionByHour);

router.get('/room/', towelConsumptionController.getConsumptionByRoom);

router.get('/room/:state/', towelConsumptionController.getConsumptionByRoom);

router.get('/expected/:expected/', towelConsumptionController.getByExpectedState);

module.exports = router;