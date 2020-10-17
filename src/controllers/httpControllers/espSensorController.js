const utils = require('../../utils');
const espSensorUseCases = require('../../use-cases/espSensorUseCases');

const handleSaveError = (err) => {
    console.log(`EspSensor Controller`);
    console.log(`An error has occured while tryng to performe a EspSensor model operation`);
    console.log(`Error: ${err}`);
};

module.exports = {
    // Method = POST
    // Action = sensor/new
    // Req.body = {sensorName: String, room_id : ObjectId}
    new : async (req, res, next) => {
        const sensorInfo = req.body;
        const savedObject = {};
        try {
            savedObject = await espSensorUseCases.newEspSensor(sensorInfo);   
            res.status(201).json({savedObject});
        } catch (error) {
            console.log(`An error has occured while saving an EspSenros`);
            console.log(`Error: ${err}`);
            res.status(400).json({error : 'EspSensor not created'});
        }
    },
    // Method = GET
    // Action = sensor/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await espSensorUseCases.getEspSensors();
            if(docs.length == 0) res.status(204).json({error : 'Resources not found'});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = sensor/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const _id = req.params._id;
        try {
            const doc = await espSensorUseCases.getEspSensorById(_id);
            if(utils.isEmpty(doc)) res.status(204).json({error : 'Resource not found', _id});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = sensor/name/:name/
    // Params = {name : String}
    getByName : async (req, res, next) => {
        const sensorName = req.params.name;
        try {
            const docs = await espSensorUseCases.getEspSensorByName(sensorName);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by name', sensorName});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = sensor/state/:state/
    // Params = {state : boolean}
    getByState : async (req, res, next) => {
        // Convert string to boolean
        const state = (req.params.state == 'true');
        try {
            const docs = await espSensorUseCases.getEspSensorByState(state);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by state', state});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = sensor/room_id/:room_id/
    // Params = {room_id : ObjectId}
    getByRoomId : async (req, res, next) => {
        const room_id = req.params.room_id;
        try {
            const docs = await espSensorUseCases.getEspSensorByRoomId(room_id);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by room id', room_id});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    }
}