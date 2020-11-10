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
const guestUseCases = require('./guestUseCases');

const handleDBOperationError = (err) => {
    console.log(`CheckOut Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

// Updates checkIn active state 
// Returns the updated checkIn document
const turnOffCheckInStatus = async (checkIn_id) => {
    let boundCheckIn = await checkInUseCases.getCheckInById({checkIn_id});
    boundCheckIn.status = false;
    return await boundCheckIn.save();
};

// Updates checkIn active state 
// Returns the updated checkIn document
const turnOffGuestStatus = async (checkIn_id) => {
    const boundCheckIn = await checkInUseCases.getCheckInById({checkIn_id});
    let guestDoc = await guestUseCases.getGuestById(boundCheckIn.guest_id);
    guestDoc.status = false;
    return await guestDoc.save();
};

// Updates room occupancyState 
// Returns the updated room document
const turnOffRoomStatus = async (room_id) => {
    let boundRoom = await roomUseCases.getRoomById({room_id});
    boundRoom.occupancyState = false;
    return await boundRoom.save();
};

// Use mqtt module to publish-back the sensor state is now turned off
const turnOffSensorStatus = async (sensorDoc) => {
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

        const checkInDoc = await turnOffCheckInStatus(inputData.checkIn_id);

        const roomDoc = await turnOffRoomStatus(checkInDoc.room_id);

        turnOffGuestStatus(inputData.checkIn_id);
        
        const sensorDoc = await espSensorUseCases.getEspSensorByRoomId({room_id : roomDoc._id});

        turnOffSensorStatus(sensorDoc);

        let totalDoc = await totalUseCases.getTotalByCheckInId({checkIn_id : checkInDoc._id});

        const totalWater = await waterConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId({
            room_id : checkInDoc.room_id,
            date1 : checkInDoc.date,
            date2 : now
        });

        const totalTowels = await towelConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId({
            room_id : checkInDoc.room_id,
            date1 : checkInDoc.date,
            date2 : now
        });
        
        // If there was consumption in the room
        // replace totals for the last count of consumption if totals dont match
        // The last count of consumption has the priority
        if(totalTowels != null && totalWater != null){
            if(!totalsMatch(totalDoc, totalWater, totalTowels)) {
                console.log('Not matched!');
                totalDoc.totals = {
                    towels : totalTowels,
                    water : totalWater
                };
                await totalDoc.save();
            }
        }

        inputData.total_id = totalDoc._id;
        inputData.date = now;

        const checkOutDocument = factories.buildCheckOutEntity(inputData);

        try { return await checkOutDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getCheckOuts : async () => {
        try { 
            return await entities.CheckOut.find({}).
            populate({
                path : 'total_id checkIn_id',
                populate : {
                    path : 'room_id guest_id',
                    select : 'roomNumber fullName'
                },
                select : ' duration date totals'
            }).
            select('date').
            exec();
        } 
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