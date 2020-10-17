const utils = require('../../utils');
const guestUseCases = require('../../use-cases/guestUseCases');

const handleSaveError = (err) => {
    console.log(`Guest Controller`);
    console.log(`An error has occured while tryng to performe a Guest model operation`);
    console.log(`Error: ${err}`);
};

module.exports = {
    // Method = POST
    // Action = guest/new/
    // Rq.body = {
    //    room_id : ObjectId,
    //    name : String,
    //    lastName1 : String,
    //    lastName2 : String,
    //    age : int,
    //    country : String
    //    email : String,
    //    phoneNumber : String
    //}
    new : async (req, res, next) => {
        const guestInfo = req.body;
        const savedObject = {};
        try {
            savedObject = await guestUseCases.newGuest(guestInfo);   
            res.status(201).json({savedObject});
        } catch (error) {
            console.log(`An error has occured while saving a Guest`);
            console.log(`Error: ${err}`);
            res.status(400).json({error : 'Guest not created'});
        }
    },
    // Method = GET
    // Action = guest/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await guestUseCases.getGuests();
            if(docs.length == 0) res.status(204).json({error : 'Resources not found'});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = guest/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const _id = req.params._id;
        try {
            const doc = await guestUseCases.getGuestById(_id);
            if(utils.isEmpty(doc)) res.status(204).json({error : 'Resource not found', _id});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = guest/name/:name/lastName1/:lm1/lastName2/:lm2
    // Params = {name : String, lastName2 : Strin, lastName2 : String}
    getByFullName : async (req, res, next) => {
        const fullName = {
            name : req.params.name,
            lastName1 : req.params.lastName1,
            lastName2 : req.params.lastName2
        };
        try {
            const doc = await guestUseCases.getGuestByFullName(fullName);
            if(utils.isEmpty(doc)) res.status(204).json({error : 'Resource not found', fullName});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = guest/age/:age/
    // Params = {age : int}
    getByAge : async (req, res, next) => {
        const age = req.params.age;
        try {
            const docs = await guestUseCases.getGuestsByAge(age);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by age', age});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = guest/age1/:age/age2/:age2
    // Params = {age1 : int, age2 : int}
    getByAgeRange : async (req, res, next) => {
        const age1 = req.params.age1;
        const age2 = req.params.age2;
        try {
            const docs = await guestUseCases.getGuestsByAgeRange(age1, age2);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by age range', age1, age2});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = guest/country/:country/
    // Params = {age : int}
    getByCountry : async (req, res, next) => {
        const country = req.params.country;
        try {
            const docs = await guestUseCases.getGuestsByCountry(country);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by country', country});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = guest/room_id/:room_id/
    // Params = {room_id : ObjectId}
    getByRoomId : async (req, res, next) => {
        const room_id = req.params.room_id;
        try {
            const docs = await guestUseCases.getGuestByRoomId(room_id);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by room id', room_id});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = guest/roomNumber/:roomNumber/
    // Params = {roomNumber : int}
    getByRoomNumber : async (req, res, next) => {
        const roomNumber = req.params.roomNumber;
        try {
            const docs = await guestUseCases.getGuestByRoomNumber(roomNumber);
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by room number', roomNumber});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    }
}