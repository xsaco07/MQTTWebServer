const express = require('express');
const router = express.Router();
const guestController = require('../controllers/httpControllers/guestController');

router.get('/', guestController.getAll);

router.get('/_id/:_id/', guestController.getById);

router.get('/name/:name/lastName1/:lastName1/lastName2/:lastName2', guestController.getByFullName);

router.get('/age/:age/', guestController.getByAge);

router.get('/age1/:age1/age2/:age2', guestController.getByAgeRange);

router.get('/country/:country/', guestController.getByCountry);

router.get('/room_id/:room_id/', guestController.getByRoomId);

router.get('/roomNumber/:roomNumber/', guestController.getByRoomNumber);

router.post('/new/', checkOutController.new);

module.exports = router;
