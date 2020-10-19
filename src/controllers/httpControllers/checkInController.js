const guestUseCases = require('../../use-cases/guestUseCases');
const checkInUseCases = require('../../use-cases/checkInUseCases');

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
        const guestInfo = {
            name : req.body.name,
            lastName1 : req.body.lastName1,
            lastName2 : req.body.lastName2,
            age : req.body.age,
            country : req.body.country,
            email : req.body.email,
            phone : req.body.phone,
            room_id : req.body.room_id
        };
        // Save new guest
        const guestDocument = await guestUseCases.newGuest(guestInfo);
        
        const checkInInfo = {
            room_id : req.body.room_id,
            guest_id : guestDocument._id,
            duration : {
                days : req.body.days,
                nights : req.body.nights
            }
        };
        const savedObject = {};
        try {
            savedObject = await checkInUseCases.newCheckIn(checkInInfo);   
            res.status(201).json({savedObject});
        } catch (error) {
            console.log(`An error has occured while saving a CheckIn`);
            console.log(`Error: ${err}`);
            res.status(400).json({error : 'CheckIn not created'});
        }
    },
    // Method = GET
    // Action = checkIn/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await checkInUseCases.getCheckIns();
            if(docs.length == 0) res.status(204).json({error : 'Resources not found'});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = checkIn/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const _id = req.params._id;
        try {
            const doc = await checkInUseCases.getCheckInById(_id);
            if(utils.isEmpty(doc)) res.status(204).json({error : 'Resource not found', _id});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = checkIn/room_id/:room_id/
    // Params = {room_id : ObjectId}
    getByRoomId : async (req, res, next) => {
        const room_id = req.params.room_id;
        try {
            const docs = await checkInUseCases.getCheckInsByRoomId({room_id});
            if(docs.length == 0) 
                res.status(204).json({error : 'Resources not found by room id', room_id});
            else res.status(200).json(docs);
        } catch (error) {
            handleSaveError(error);
        }
    },
    // Method = GET
    // Action = checkIn/date1/:date1/date2/:date2
    // Params = {date1 : String, date2 : String}
    getByDateRange : async (req, res, next) => {
        const date1 = req.params.date1;
        const date2 = req.params.date2;
        try {
            const docs = await checkInUseCases.getCheckInsByDateRange({date1, date2});
            if(docs.length == 0)
                res.status(204).json({error : 'Resources not found by dates', date1, date2});
        } catch (error) {
            handleSaveError(error);
        }
    }
}