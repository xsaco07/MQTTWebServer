const entities = require('../entities/entities');
const factories = require('../entities/factories');
const roomUseCases = require('../use-cases/roomUseCases');
const espSensorUseCases = require('../use-cases/espSensorUseCases');
const mqtt = require('./../mqtt/mqtt');

const handleDBOperationError = (err) => {
    console.log(`CheckIn Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

// Update room occupancyState 
// Returns the updated room document
const turnOnRoomState = async (room_id) => {
    // Update room occupancyState 
    let roomDocument = await roomUseCases.getRoomById({room_id});
    roomDocument.occupancyState = true;
    return await roomDocument.save();
};

// Creates a Total document given the checkIn id
// Returns sensor document
const createTotalObject = async (checkIn_id, room_id) => {
    console.log(checkIn_id);
    console.log(room_id);
    const sensorDoc = await espSensorUseCases.getEspSensorByRoomId({room_id});
    const totalObject = factories.buildTotalEntity({
        checkIn_id,
        sensor_id : sensorDoc._id
    });
    await totalObject.save();
    return sensorDoc;
};

// Use mqtt module to publish-back the sensor state now turned on
const turnOnSensorState = async (sensorDoc) => {
    sensorDoc.status = true;
    await sensorDoc.save();
    const stateObject = factories.buildSensorStateEntity(true);
    mqtt.publishStateMessage(sensorDoc.sensorName, stateObject);
};

module.exports = {
    // inputData = {room_id : ObjectId, guest_id : ObjectId, duration : {days : int, nights : int}}
    newCheckIn : async (inputData) => {
        try {
            console.log(inputData);
            // Build and save object
            const finalObject = {
                room_id : inputData.room_id,
                guest_id : inputData.guest_id,
                duration : inputData.duration
            };
            const checkInDocument = factories.buildCheckInEntity(finalObject);
            const savedObject = await checkInDocument.save();
            
            // Actions post save
            const roomDoc = await turnOnRoomState(inputData.room_id);
            const sensorDoc = await createTotalObject(savedObject._id, roomDoc._id);
            turnOnSensorState(sensorDoc);

            return savedObject;
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getCheckIns : async () => {
        try { return await entities.CheckIn.
            find({}).
            populate('room_id').
            populate('guest_id').
            exec(); 
        } 
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
    // inputData = {date1 : Date, date2 : Date}
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