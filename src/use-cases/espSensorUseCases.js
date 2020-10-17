const entities = require('../entities/entities');
const factories = require('../entities/factories');

const handleSaveError = (err) => {
    console.log(`EspSensor Use Case`);
    console.log(`An error has occured while tryng to performe a CheckOut model operation`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {sensorName : String, state : boolean, room_id : ObjectId}
    newEspSensor : async () => {
        const sensorDocument = factories.buildEspSensorEntity(inputData);
        sensorDocument.save((err) => {
            handleSaveError(err);
        });
    },
    // inputData = {}
    getEspSensors : async (inputData) => {
        let docs = [];
        try {docs = await entities.EspSensor.find({});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData = {sensor_id : ObjectId}
    getEspSensorById : async (inputData) => {
        let doc = {};
        try {doc = await entities.EspSensor.findById(inputData.sensor_id);} 
        catch (error) {handleSaveError(error);}
        finally {return doc[0];}
    },
    // inputData = {sensorName : String}
    getEspSensorByName : async (inputData) => {
        let doc = {};
        try {doc = await entities.EspSensor.find({sensorName : inputData.sensorName});} 
        catch (error) {handleSaveError(error);}
        finally {return doc;}
    },
    // inputData = {sensorState : boolean}
    getEspSensorByState : async (inputData) => {
        let docs = [];
        try {docs = await entities.EspSensor.find({sensorState : inputData.sensorState});} 
        catch (error) {handleSaveError(error);}
        finally {return doc;}
    },
    // inputData = {room_id : ObjectId}
    getEspSensorByRoomId : async (inputData) => {
        let doc = {};
        try {doc = await entities.EspSensor.find({room_id : inputData.room_id});} 
        catch (error) {handleSaveError(error);}
        finally {return doc[0];}
    }
};