const entities = require('../entities/entities');
const factories = require('../entities/factories');
const utils = require('../utils/utils');
const roomUseCases = require('../use-cases/roomUseCases');
const checkInUseCases = require('../use-cases/checkInUseCases');
const espSensorUseCases = require('./espSensorUseCases');
const totalUseCases = require('./totalUseCases');
const towelConsumptionUseCases = require('./towelConsumptionUseCases');
const waterConsumptionUseCases = require('./waterConsumptionUseCases');
const mqtt = require('./../mqtt/mqtt');

const handleDBOperationError = (err) => {
    console.log(`CheckOut Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

// Updates checkIn active state 
// Returns the updated checkIn document
const turnOffCheckInState = async (checkIn_id) => {
    let boundCheckIn = await checkInUseCases.getCheckInById({checkIn_id});
    boundCheckIn.status = false;
    return await boundCheckIn.save();
};

// Updates room occupancyState 
// Returns the updated room document
const turnOffRoomState = async (room_id) => {
    let boundRoom = await roomUseCases.getRoomById({room_id});
    boundRoom.occupancyState = false;
    return await boundRoom.save();
};

// Use mqtt module to publish-back the sensor state is now turned off
const turnOffSensorState = async (sensorDoc) => {
    sensorDoc.state = false;
    await sensorDoc.save();
    const stateObject = factories.buildSensorStateEntity(false);
    mqtt.publishStateMessage(sensorDoc.sensorName, stateObject);
};

// Check if the totals object data match with the las count performed
const totalsMatch = (totalDoc, totalWater, totalTowels) => {
    return totalDoc.totals.towels.consumption == totalTowels.consumption
    && totalDoc.totals.water.consumption == totalWater.consumption
    && totalDoc.totals.totalConsumption == totalTowels.consumption + totalWater.consumption
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
        
        const sensorDoc = await espSensorUseCases.getEspSensorByRoomId({room_id : roomDoc._id});

        turnOffSensorState(sensorDoc);

        let totalDoc = await totalUseCases.getTotalByCheckInId({checkIn_id : checkInDoc._id});

        let totalWater = await waterConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            checkInDoc.room_id,
            checkInDoc.date,
            now);

        let totalTowels = await towelConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            checkInDoc.room_id,
            checkInDoc.date,
            now);
        
        // Replace totals for the last count of consumption if totals dont match
        // The last count of consumption has the priority
        if(!totalsMatch(totalDoc, totalWater, totalTowels)) {
            console.log('Not matched!');
            totalDoc.totals = {
                towels : totalTowels,
                water : totalWater
            };
            await totalDoc.save();
        }

        inputData.total_id = totalDoc._id;
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