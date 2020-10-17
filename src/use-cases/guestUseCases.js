const entities = require('../entities/entities');
const factories = require('../entities/factories');
const roomUseCases = require('../use-cases/roomUseCases');

const handleSaveError = (err) => {
    console.log(`Guest Use Case`);
    console.log(`An error has occured while tryng to performe a Guest model operation`);
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
        guestDocument.save((err) => {
            if(err) handleSaveError(err);
        });
        return guestDocument;
    },
    // inputData = {}
    getGuests : async () => {
        let docs = [];
        try {docs = await entities.Guest.find({});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData = {guest_id : ObjectId}
    getGuestById : async (inputData) => {
        let doc = {};
        try {doc = await entities.Guest.findById(inputData.guest_id);}
        catch (error) {handleSaveError(error);}
        finally {return doc[0];}
    },
    // inputData = {name : String, lastName1 : String, lastName2 : String}
    getGuestByFullName : async (inputData) => {
        let doc = {};
        try {doc = await entities.Guest.find({
            fullName : {
                name : inputData.name,
                lastName1 : inputData.lastName1,
                lastName2 : inputData.lastName2
            }
        });}
        catch (error) {handleSaveError(error);}
        finally {return doc;}
    },
    // inputData = {age : int}
    getGuestsByAge : async (inputData) => {
        let docs = [];
        try {docs = entities.Guest.find({age : inputData.age});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData = {age1 : int, age2 : int}
    getGuestsByAgeRange : async (inputData) => {
        let docs = [];
        try {docs = entities.Guest.find({age : {$gte : inputData.age1, $lte : inputData.age2}});} 
        catch (error) {handleSaveError(error);}
        finally{return docs;}
    },
    // inputData = {country : String}
    getGuestsByCountry : async (inputData) => {
        let docs = [];
        try {docs = entities.Guest.find({country : inputData.country});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData = {room_id : ObjectId}
    getGuestByRoomId : async (inputData) => {
        let docs = [];
        try {docs = entities.Guest.find({room_id : inputData.room_id});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // input Data = {roomNumber = int}
    getGuestByRoomNumber : async (inputData) => {
        const room = roomUseCases.getRoomByNumber({roomNumber : inputData.roomNumber});
        return this.getGuestByRoomId({room_id : room._id});
    }
}