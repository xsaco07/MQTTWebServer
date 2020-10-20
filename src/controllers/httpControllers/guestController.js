const {handleGetRequestError, handlePostRequestError} = require('../../utils/errorHandlers');
const guestUseCases = require('../../use-cases/guestUseCases');

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
    //    phone : String
    //}
    new : async (req, res, next) => {
        const guestInfo = req.body;
        try {
            const savedObject = await guestUseCases.newGuest(guestInfo);   
            res.status(201).json(savedObject);
        } catch (error) { handlePostRequestError(error, res); }
    },
    // Method = GET
    // Action = guest/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await guestUseCases.getGuests();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = guest/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const guest_id = req.params._id;
        try {
            const doc = await guestUseCases.getGuestById({guest_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
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
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = guest/age/:age/
    // Params = {age : int}
    getByAge : async (req, res, next) => {
        const age = req.params.age;
        try {
            const docs = await guestUseCases.getGuestsByAge({age});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = guest/age1/:age/age2/:age2
    // Params = {age1 : int, age2 : int}
    getByAgeRange : async (req, res, next) => {
        const age1 = req.params.age1;
        const age2 = req.params.age2;
        try {
            const docs = await guestUseCases.getGuestsByAgeRange({age1, age2});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = guest/country/:country/
    // Params = {age : int}
    getByCountry : async (req, res, next) => {
        const country = req.params.country;
        try {
            const docs = await guestUseCases.getGuestsByCountry({country});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = guest/room_id/:room_id/
    // Params = {room_id : ObjectId}
    getByRoomId : async (req, res, next) => {
        const room_id = req.params.room_id;
        try {
            const doc = await guestUseCases.getGuestByRoomId({room_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    }
}