const entities = require('../entities/entities');
const factories = require('../entities/factories');

const handleSaveError = (err) => {
    console.log(`Room Use Case`);
    console.log(`An error has occured while tryng to performe a Room model operation`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {

    // inputData = {roomNumber: int, capacity: int}
    newRoom : async (inputData) => {
        const roomDocument = factories.buildRoomEntity(inputData);
        roomDocument.save((err) => {
            if(err) handleSaveError(err);
        });
        return roomDocument;
    },
    // inputData = {}
    getRooms : async () => {
        let docs = [];
        try {docs = await entities.Room.find({});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData = {room_id : ObjectId}
    getRoomById : async (inputData) => {
        let doc = {};
        try {doc = await entities.Room.findById(inputData.room_id);} 
        catch (error) {handleSaveError(error);}
        finally {return doc[0];}
    },
    // inputData = {roomNumber : int}
    getRoomByNumber : async (inputData) => {
        let doc = {};
        try {doc = await entities.Room.findOne({roomNumber : inputData.roomNumber});} 
        catch (error) {handleSaveError(error);}
        finally {return (!doc ? {} : doc);}
    },
    // inputData =  {capacity : int}
    getRoomsByCapacity : async (inputData) => {
        let docs = [];
        try { docs = await entities.Room.find({capacity : inputData.capacity});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData =  {occupancyState : boolean}
    getRoomsByOccupancyState : async (inputData) => {
        let docs = [];
        try {docs = await entities.Room.find({occupancyState : inputData.occupancyState});} 
        catch (error) {handleSaveError(error);}
        finally { return docs;}
    },
}