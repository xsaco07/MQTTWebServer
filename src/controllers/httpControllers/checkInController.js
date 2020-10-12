const entities = require('../../entities/entities');
const roomController = require('../httpControllers/roomController');

module.exports {

    // Input: roomNumber, days, nights
    // {roomNumber: 5, days: 3, nights: 2}
    newCheckIn : async (req, res, next) => {
        const data = req.body;
    },
    getCheckIns,
    getCheckInsByRoom,
    getCheckIndByDateRange
}