const {handleGetRequestError, handlePostRequestError} = require('../../utils/errorHandlers');
const espSensorUseCases = require('../../use-cases/espSensorUseCases');

module.exports = {
    // Method = POST
    // Action = sensor/new/
    // Req.body = {sensorName: String, room_id : ObjectId}
    new : async (req, res, next) => {
        const sensorInfo = req.body;
        try {
            const savedObject = await espSensorUseCases.newEspSensor(sensorInfo);   
            res.status(201).json(savedObject);
        } catch (error) { handlePostRequestError(error, res); }
    },
    // Method = GET
    // Action = sensor/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await espSensorUseCases.getEspSensors();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = sensor/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const sensor_id = req.params._id;
        try {
            const doc = await espSensorUseCases.getEspSensorById({sensor_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = sensor/name/:name/
    // Params = {name : String}
    getByName : async (req, res, next) => {
        const sensorName = req.params.name;
        try {
            const doc = await espSensorUseCases.getEspSensorByName({sensorName});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = sensor/state/:state/
    // Params = {state : boolean}
    getByState : async (req, res, next) => {
        const state = req.params.state;
        try {
            const docs = await espSensorUseCases.getEspSensorByState({state});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = sensor/room_id/:room_id/
    // Params = {room_id : ObjectId}
    getByRoomId : async (req, res, next) => {
        const room_id = req.params.room_id;
        try {
            const docs = await espSensorUseCases.getEspSensorByRoomId({room_id});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    }
}