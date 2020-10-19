const entities = require('../entities/entities');
const factories = require('../entities/factories');

const handleDBOperationError = (err) => {
    console.log(`Room Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {

    // inputData = {roomNumber: int, capacity: int}
    newRoom : async (inputData) => {
        const roomDocument = factories.buildRoomEntity(inputData);
        try { return await roomDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getRooms : async () => {
        try { return await entities.Room.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {room_id : ObjectId}
    getRoomById : async (inputData) => {
        try { return await entities.Room.findById(inputData.room_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {roomNumber : int}
    getRoomByNumber : async (inputData) => {
        try { return await entities.Room.findOne({roomNumber : inputData.roomNumber}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData =  {capacity : int}
    getRoomsByCapacity : async (inputData) => {
        try { return await entities.Room.find({capacity : inputData.capacity}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData =  {occupancyState : boolean}
    getRoomsByOccupancyState : async (inputData) => {
        try { return await entities.Room.find({occupancyState : inputData.occupancyState}); } 
        catch (error) { handleDBOperationError(error); }
    },
}