const entities = require('../entities/entities');

const handleSaveError = (err) => {
    console.log(`Room Use Case`);
    console.log(`An error has occured while tryng to performe a Room model operation`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {

    // inputData = {roomNumber: X, capacity: Y}
    newRoom : async (inputData) => {
        const roomDocument = new entities.Room(inputData);
        roomDocument.save((err) => {
            if(err) handleSaveError(err);
        });
    },
    // inputData = {}
    getRooms : async () => {
        let docs = [];
        try {
            docs = await entities.Room.find({});   
        } catch (error) {
            handleSaveError(error);
        }
        finally {
            return docs;
        }
        
    },
    // inputData = {room_id : ObjectId}
    getRoomById : async (inputData) => {
        const room_id = inputData.room_id;
        let doc = {};
        try {
            doc = await entities.Room.findById(room_id);   
        } catch (error) {
            handleSaveError(error);
        }
        finally {
            return doc;
        }
    },
    // inputData = {roomNumber : int}
    getRoomByNumber : async (inputData) => {
        const roomNumber = inputData.roomNumber;
        let doc = {};
        try {
            doc = await entities.Room.findOne({roomNumber});   
        } catch (error) {
            handleSaveError(error);
        }
        finally {
            return (!doc ? {} : doc);
        }
    },
    // inputData =  {capacity : int}
    getRoomsByCapacity : async (inputData) => {
        const capacity = inputData.capacity;
        let docs = [];
        try {
            docs = await entities.Room.find({capacity});   
        } catch (error) {
            handleSaveError(error);
        }
        finally {
            return docs;
        }
    },
    // inputData =  {occupancyState : boolean}
    getRoomsByOccupancyState : async (inputData) => {
        const occupancyState = inputData.occupancyState;
        let docs = [];
        try {
            docs = await entities.Room.find({occupancyState});   
        } catch (error) {
            handleSaveError(error);
        }
        finally {
            return docs;
        }
    },
}