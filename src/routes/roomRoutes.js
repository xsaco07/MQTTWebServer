const express = require('express');
const router = express.Router();
const roomController = require('../controllers/httpControllers/roomController');

router.get('/', roomController.getAll);

router.get('/room_number/:roomNumber/', roomController.getByNumber);

router.get('/capacity/:capacity/', roomController.getByCapacity);

router.get('/occupancy/:occupancyState/', roomController.getByOccupancyState);

router.post('/new/', roomController.new);

module.exports = router;

