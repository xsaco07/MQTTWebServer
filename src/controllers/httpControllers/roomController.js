const roomUseCases = require('../../use-cases/roomUseCases');
const {handleGetRequestError, handlePostRequestError} = require('../../utils/errorHandlers');

module.exports = {
    // Method = POST
    // Action = room/new/
    // Req.body = {roomNumber: int, capacity: int}
    new : async (req, res, next) => {
        const roomDocument = req.body;
        try {
            const savedObject = await roomUseCases.newRoom(roomDocument);   
            res.status(201).json(savedObject);
        } catch (error) { handlePostRequestError(error, res); }
    },
    // Method = GET
    // Action = room/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await roomUseCases.getRooms();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = /rooms/_id/:_id/
    // Params =  {_id : ObjectId}
    getById : async (req, res, next) => {
        try {
            const _id = req.params._id;
            const doc = await roomUseCases.getRoomById({room_id : _id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = /rooms/room_number/:roomNumber/
    // Params =  {roomNumber : int}
    getByNumber : async (req, res, next) => {
        try {
            const roomNumber = req.params.roomNumber;
            const doc = await roomUseCases.getRoomByNumber({roomNumber});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = rooms/capacity/:capacity/
    // Params =  {capacity : int}
    getByCapacity : async (req, res, next) => {
        try {
            const capacity = req.params.capacity;
            const docs = await roomUseCases.getRoomsByCapacity({capacity});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = rooms/occupancy/:occupancyState/
    // Req.body =  {occupancyState : true}
    getByOccupancyState : async (req, res, next) => {
        try {
            const occupancyState = req.params.occupancyState;
            const docs = await roomUseCases.getRoomsByOccupancyState({occupancyState});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    }
}