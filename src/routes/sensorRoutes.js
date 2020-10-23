const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/httpControllers/espSensorController');

router.get('/', sensorController.getAll);

router.get('/_id/:_id/', sensorController.getById);

router.get('/name/:name/', sensorController.getByName);

router.get('/state/:state/', sensorController.getByState);

router.get('/room_id/:room_id/', sensorController.getByRoomId);

router.post('/new/', sensorController.new);

module.exports = router;
