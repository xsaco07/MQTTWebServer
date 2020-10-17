const entities = require('../../entities/entities');
const roomController = require('../httpControllers/roomController');
const guestUseCases = require('../../use-cases/guestUseCases');

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
        const guestDocument = guestUseCases.newGuest(guestInfo);
        const checkInInfo = {
            room_id : req.body.room_id,
            guest_id : (await guestDocument)._id,
            duration : {
                days : req.body.days,
                nights : req.body.nights
            }
        };
        try {
            savedObject = await guestUseCases.newGuest(guestInfo);   
            res.status(201).json({savedObject});
        } catch (error) {
            console.log(`An error has occured while saving a Guest`);
            console.log(`Error: ${err}`);
            res.status(400).json({error : 'Guest not created'});
        }
    },
    getAll,
    getByRoomId,
    getByDateRange
}