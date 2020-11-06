const guestUseCases = require('../../use-cases/guestUseCases');
const espSensorUseCases = require('../../use-cases/espSensorUseCases');
const checkInUseCases = require('../../use-cases/checkInUseCases');
const {handleGetRequestError, handlePostRequestError} = require('../../utils/errorHandlers');
const totalUseCases = require('../../use-cases/totalUseCases');

module.exports = {
    // Method = POST
    // Action = checkIn/new/
    // Req.body = {
    //    room_id: ObjectId,
    //    name : String,
    //    lastName1 : String,
    //    lastName2 : String,
    //    age : int,
    //    country : String
    //    email : String,
    //    phone : String
    //    days : int,
    //    nights : int
    // }
    new : async (req, res, next) => {
        try {
            const room_id = req.body.room_id;
            // Save new guest
            const guestInfo = {
                name : req.body.name,
                lastName1 : req.body.lastName1,
                lastName2 : req.body.lastName2,
                age : req.body.age,
                country : req.body.country,
                room_id
            };

            // Save guest object
            const guestDocument = await guestUseCases.newGuest(guestInfo);

            // Save checkIn object
            const checkInInfo = {
                room_id,
                guest_id : guestDocument._id,
                duration : {
                    days : req.body.days,
                    nights : req.body.nights
                }
            };
            const savedObject = await checkInUseCases.newCheckIn(checkInInfo);

            // Send response
            res.status(201);
            res.redirect('/checkIns/');
            

        } catch (error) { handlePostRequestError(error, res); }
    },
    // Method = GET
    // Action = checkIn/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await checkInUseCases.getCheckIns();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = checkIn/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const checkIn_id = req.params._id;
        try {
            const doc = await checkInUseCases.getCheckInById({checkIn_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = checkIn/room_id/:room_id/
    // Params = {room_id : ObjectId}
    getByRoomId : async (req, res, next) => {
        const room_id = req.params.room_id;
        try {
            const docs = await checkInUseCases.getCheckInsByRoomId({room_id});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = checkIn/status/:status/
    // Params = {status : Boolean}
    getByStatus : async (req, res, next) => {
        const status = req.params.status;
        try {
            const docs = await checkInUseCases.getCheckInByStatus({status});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = checkIn/date1/:date1/:date2
    // Params = {date1 : String, date2 : String}
    getByDateRange : async (req, res, next) => {
        const date1 = req.params.date1;
        const date2 = req.params.date2;
        try {
            const docs = await checkInUseCases.getCheckInsByDateRange({date1, date2});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    metrics : {
        getActiveCheckIns : async (req, res, next) => {
            try {
                const total = await checkInUseCases.metrics.activeCheckIns();
                if(total == null || Object.keys(total).length == 0) res.status(204).end();
                else res.status(200).json(total);
            } catch (error) { handleGetRequestError(error, res); }
        }
    }
}