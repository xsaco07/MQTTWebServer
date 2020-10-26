const entities = require('../entities/entities');
const factories = require('../entities/factories');
const utils = require('../utils/utils');
const useCases = require('../use-cases/useCases');
const mqtt = require('./../mqtt/mqtt');

const handleDBOperationError = (err) => {
    console.log(`CheckOut Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

// Resets the values to 0 for the totals object
// Returns sensor document
const resetTotalObject = async (room_id) => {

};

// Updates checkIn active state 
// Returns the updated checkIn document
const turnOffCheckInState = async (checkIn_id) => {
    let boundCheckIn = await useCases.checkInUseCases.getCheckInById({checkIn_id});
    boundCheckIn.status = false;
    return await boundCheckIn.save();
};

// Updates room occupancyState 
// Returns the updated room document
const turnOffRoomState = async (room_id) => {
    let boundRoom = await useCases.roomUseCases.getRoomById({room_id});
    boundRoom.occupancyState = false;
    return await boundRoom.save();
};

// Use mqtt module to publish-back the sensor state is now turned off
const turnOffSensorState = async (sensorDoc) => {
    sensorDoc.status = false;
    await sensorDoc.save();
    const stateObject = factories.buildSensorStateEntity(false);
    mqtt.publishStateMessage(sensorDoc.sensorName, stateObject);
};

module.exports = {
    // inputData = {checkIn_id : ObjectId}
    newCheckOut : async (inputData) => {

        // Getting current date is the first step in case 
        // other operations take too much to execute
        let now = new Date();
        now.setHours(now.getHours() - utils.offsetUTCHours);

        const checkInDoc = await turnOffCheckInState(inputData.checkIn_id);

        const roomDoc = await turnOffRoomState(checkInDoc.room_id);
        
        const sensorDoc = await resetTotalObject(roomDoc._id);

        turnOffSensorState(sensorDoc);

        let totalWater = await useCases.waterConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            boundCheckIn.room_id,
            boundCheckIn.date,
            now);

        let totalTowels = await useCases.towelConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            boundCheckIn.room_id,
            boundCheckIn.date,
            now);

        inputData.totalWaterConsumption = totalWater;
        inputData.totalTowelsConsumption = totalTowels;
        inputData.date = now;

        const checkOutDocument = factories.buildCheckOutEntity(inputData);

        try { return await checkOutDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getCheckOuts : async () => {
        try { return await entities.CheckOut.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {_id : ObjectId}
    getCheckOutsById : async (inputData) => {
        try { return await entities.CheckOut.findById(inputData._id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {checkIn_id : ObjectId}
    getCheckOutsByCheckInId : async (inputData) => {
        try { return await entities.CheckOut.findOne({checkIn_id : inputData.checkIn_id}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {date1 : Date, date2 : Date2}
    getCheckOutsByDateRange : async (inputData) => {
        try {
            return await entities.CheckOut.find({
                date : { 
                    $gte: inputData.date1, 
                    $lte: inputData.date2
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    }
}