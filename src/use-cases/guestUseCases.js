const entities = require('../entities/entities');
const factories = require('../entities/factories');
const roomUseCases = require('../use-cases/roomUseCases');

const handleDBOperationError = (err) => {
    console.log(`Guest Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {name : '', 
    //              lastName1 : '',
    //              lastName2 : '', 
    //              age : X, 
    //              country : '', 
    //              email : '',
    //              phoneNumber : '',
    //              room_id : ObjectId}
    newGuest : async (inputData) => {
        const finalObject = Object.freeze({
            fullName : {
                name : inputData.name, 
                lastName1 : inputData.lastName1,
                lastName2 : inputData.lastName2
            },
            age : inputData.age,
            country : inputData.country,
            email : inputData.email,
            phoneNumber : inputData.phoneNumber,
            room_id : inputData.room_id
        });
        const guestDocument = factories.buildGuestEntity(finalObject);
        try { return await guestDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getGuests : async () => {
        try { return await entities.Guest.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {guest_id : ObjectId}
    getGuestById : async (inputData) => {
        try { return await entities.Guest.findById(inputData.guest_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {name : String, lastName1 : String, lastName2 : String}
    getGuestByFullName : async (inputData) => {
        try { 
            return await entities.Guest.find({
                fullName : {
                    name : inputData.name,
                    lastName1 : inputData.lastName1,
                    lastName2 : inputData.lastName2
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {age : int}
    getGuestsByAge : async (inputData) => {
        try { return entities.Guest.find({age : inputData.age}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {age1 : int, age2 : int}
    getGuestsByAgeRange : async (inputData) => {
        try { return entities.Guest.find({age : {$gte : inputData.age1, $lte : inputData.age2}}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {country : String}
    getGuestsByCountry : async (inputData) => {
        try { return entities.Guest.find({country : inputData.country}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {room_id : ObjectId}
    getGuestByRoomId : async (inputData) => {
        try { return entities.Guest.findOne({room_id : inputData.room_id}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // input Data = {roomNumber = int}
    getGuestByRoomNumber : async (inputData) => {
        const room = roomUseCases.getRoomByNumber({roomNumber : inputData.roomNumber});
        return this.getGuestByRoomId({room_id : room._id});
    }
}