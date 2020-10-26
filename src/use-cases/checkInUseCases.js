const entities = require('../entities/entities');
const factories = require('../entities/factories');
const useCases = require('../use-cases/useCases');
const mqtt = require('./../mqtt/mqtt');
const {Total} = require('../utils/Total');
const { TOTALS_LIST } = require('../utils/lastTotalsList');

const handleDBOperationError = (err) => {
    console.log(`CheckIn Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

// Update room occupancyState 
// Returns the updated room document
const turnOnRoomState = async (room_id) => {
    // Update room occupancyState 
    let roomDocument = await useCases.roomUseCases.getRoomById({room_id});
    roomDocument.occupancyState = true;
    return await roomDocument.save();
};

// Creates a new local Total object associated to a sensor
// Returns sensor document
const createTotalObject = async (room_id) => {
    const boundSensor = await useCases.espSensorUseCases.getEspSensorByRoomId({room_id});
    const currentTotalObject = new Total(boundSensor.sensorName);
    TOTALS_LIST[boundSensor.sensorName] = currentTotalObject;
    console.log(TOTALS_LIST);
    return boundSensor;
};

// Use mqtt module to publish-back the sensor state now turned on
const turnOnSensorState = async (sensorDoc) => {
    sensorDoc.status = false;
    await sensorDoc.save();
    const stateObject = factories.buildSensorStateEntity(true);
    mqtt.publishStateMessage(sensorDoc.sensorName, stateObject);
};

module.exports = {
    // inputData = {room_id : ObjectId, guest_id : ObjectId, duration : {days : int, nights : int}}
    newCheckIn : async (inputData) => {
        try {
            const finalObject = {
                room_id : inputData.room_id,
                guest_id : inputData.guest_id,
                duration : inputData.duration
            };

            const roomDoc = await turnOnRoomState(inputData.room_id);
            const sensorDoc = await createTotalObject(roomDoc._id);
            turnOnSensorState(sensorDoc);

            const checkInDocument = factories.buildCheckInEntity(finalObject);
            return await checkInDocument.save(); 
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getCheckIns : async () => {
        try { return await entities.CheckIn.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {checkIn_id : ObjectId}
    getCheckInById : async (inputData) => {
        try { return await entities.CheckIn.findById(inputData.checkIn_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {room_id : ObjectId}
    getCheckInsByRoomId : async (inputData) => {
        try { return await entities.CheckIn.find({room_id : inputData.room_id}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {status : Boolean}
    getCheckInByStatus : async (inputData) => {
        try { return await entities.CheckIn.find({status : inputData.status}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {days : int, nights : int}
    getCheckInsByDuration : async (inputData) => {
        try {
            return await entities.CheckIn.find({
                duration : {
                    days : inputData.days,
                    nights : inputData.nights
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {date1 : Date, date2 : Date2}
    getCheckInsByDateRange : async (inputData) => {
        try { 
            return await entities.CheckIn.find({
                date : { 
                    $gte: inputData.date1, 
                    $lte: inputData.date2
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    }
}