const express = require('express');
const router = express.Router();
const totalController = require('../controllers/httpControllers/totalController');

router.get('/', totalController.getAll);

router.get('/_id/:_id/', totalController.getById);

router.get('/checkIn_id/:_id/', totalController.getByCheckInId);

router.get('/sensor_id/:_id/', totalController.getBySensorId);

router.post('/new/', totalController.new);

module.exports = router;