const entities = require('../entities/entities');
const factories = require('../entities/factories');

const handleDBOperationError = (err) => {
    console.log(`EspSensor Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {sensorName : String, room_id : ObjectId}
    newEspSensor : async (inputData) => {
        const sensorDocument = factories.buildEspSensorEntity(inputData);
        try { return await sensorDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getEspSensors : async (inputData) => {
        try { 
            return await entities.EspSensor.find({}).
            populate('room_id').exec(); 
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {sensor_id : ObjectId}
    getEspSensorById : async (inputData) => {
        try { return await entities.EspSensor.findById(inputData.sensor_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {sensorName : String}
    getEspSensorByName : async (inputData) => {
        try { return await entities.EspSensor.findOne({sensorName : inputData.sensorName}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {state : boolean}
    getEspSensorByState : async (inputData) => {
        try { return await entities.EspSensor.find({state : inputData.state}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {room_id : ObjectId}
    getEspSensorByRoomId : async (inputData) => {
        try { return await entities.EspSensor.findOne({room_id : inputData.room_id}); } 
        catch (error) { handleDBOperationError(error); }
    }
};