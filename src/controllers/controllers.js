const roomController = require('./httpControllers/roomController');
const guestController = require('./httpControllers/guestController');
const espSensorController = require('./httpControllers/espSensorController');
const checkInController = require('./httpControllers/checkInController');
const checkOutController = require('./httpControllers/checkOutController');
const towelConsumptionController = require('./mqttControllers/towelConsumptionController');
const waterConsumptionController = require('./mqttControllers/waterConsumptionController');

module.exports = {
    roomController,
    guestController,
    espSensorController,
    checkInController,
    checkOutController,
    towelConsumptionController,
    waterConsumptionController
}