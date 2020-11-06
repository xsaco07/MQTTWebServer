const {CheckIn} = require('../entities/checkInEntity');
const {CheckOut} = require('../entities/checkOutEntity');
const {EspSensor} = require('../entities/espSensorEntity');
const {Guest} = require('../entities/guestEntity');
const {Room} = require('../entities/roomEntity');
const {TowelConsumption} = require('../entities/towelConsumptionEntity');
const {WaterConsumption} = require('../entities/waterConsumptionEntity');
const {Total} = require('./totalEntity');

module.exports = {
    CheckIn,
    CheckOut,
    EspSensor,
    Guest,
    Room,
    TowelConsumption,
    WaterConsumption,
    Total
}