const express = require('express');
const router = express.Router();
const userController = require('../controllers/httpControllers/userController');

router.get('/', userController.getAll);

router.get('/_id/:_id/', userController.getById);

router.get('/name/:name/lastName1/:lastName1/lastName2/:lastName2', userController.getByFullName);

router.get('/userName/:userName/', userController.getByUserName);

router.post('/new/', userController.new);

module.exports = router;
