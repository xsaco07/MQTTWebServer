const express = require('express');
const router = express.Router();
const roomController = require('../controllers/httpControllers/roomController');

router.get('/', (req, res, next) => {
    res.send('Hello world');
});

router.get('/room/', roomController.getAll);

router.get('/room/room_number/:roomNumber/', roomController.getByNumber);

router.get('/room/capacity/:capacity/', roomController.getByCapacity);

router.get('/room/occupancy/:occupancyState/', roomController.getByOccupancyState);

router.post('/room/new/', roomController.new);

module.exports = router;

