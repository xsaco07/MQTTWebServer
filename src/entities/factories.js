const {buildCheckInEntity} = require('../entities/checkInEntity');
const {buildCheckOutEntity} = require('../entities/checkOutEntity');
const {buildEspSensorEntity} = require('../entities/espSensorEntity');
const {buildGuestEntity} = require('../entities/guestEntity');
const {buildRoomEntity} = require('../entities/roomEntity');
const {buildTowelConsumptionEntity} = require('../entities/towelConsumptionEntity');
const {buildWaterConsumptionEntity} = require('../entities/waterConsumptionEntity');
const {buildTotalTowelsConsumptionEntity} = require('../entities/totalTowelsConsumptionEntity');
const {buildTotalWaterConsumptionEntity} = require('../entities/totalWaterConsumptionEntity');

module.exports = {
    buildCheckInEntity,
    buildCheckOutEntity,
    buildEspSensorEntity,
    buildGuestEntity,
    buildRoomEntity,
    buildTowelConsumptionEntity,
    buildWaterConsumptionEntity,
    buildTotalTowelsConsumptionEntity,
    buildTotalWaterConsumptionEntity
}