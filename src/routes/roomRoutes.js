const express = require('express');
const router = express.Router();
const roomController = require('../controllers/httpControllers/roomController');

router.get('/', (req, res, next) => {
    res.send('Hello world');
});

router.get('/room/', roomController.getRooms);

router.get('/room/room_number/:roomNumber/', roomController.getRoomByNumber);

router.get('/room/capacity/:capacity/', roomController.getRoomsByCapacity);

router.get('/room/occupancy/:occupancyState/', roomController.getRoomsByOccupancyState);

router.post('/room/new/', roomController.newRoom);

module.exports = router;

