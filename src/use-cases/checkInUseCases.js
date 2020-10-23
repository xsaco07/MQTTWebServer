const entities = require('../entities/entities');
const factories = require('../entities/factories');
const roomUseCases = require('../use-cases/roomUseCases');

const handleDBOperationError = (err) => {
    console.log(`CheckIn Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {room_id : ObjectId, guest_id : ObjectId, duration : {days : int, nights : int}}
    newCheckIn : async (inputData) => {
        const finalObject = {
            room_id : inputData.room_id,
            guest_id : inputData.guest_id,
            duration : inputData.duration
        };

        try {
            // Update room occupancyState 
            const checkInDocument = factories.buildCheckInEntity(finalObject);
            let roomDocument = await roomUseCases.getRoomById({room_id : inputData.room_id});
            roomDocument.occupancyState = true;
            await roomDocument.save();

            return await checkInDocument.save(); 
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getCheckIns : async () => {
        try { return await entities.CheckIn.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {checkIn_id : ObjectId}
    getCheckInById : async (inputData) => {
        try { return await entities.CheckIn.findById(inputData.checkIn_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {room_id : ObjectId}
    getCheckInsByRoomId : async (inputData) => {
        try { return await entities.CheckIn.find({room_id : inputData.room_id}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {status : Boolean}
    getCheckInByStatus : async (inputData) => {
        try { return await entities.CheckIn.find({status : inputData.status}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {days : int, nights : int}
    getCheckInsByDuration : async (inputData) => {
        try {
            return await entities.CheckIn.find({
                duration : {
                    days : inputData.days,
                    nights : inputData.nights
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {date1 : Date, date2 : Date2}
    getCheckInsByDateRange : async (inputData) => {
        try { 
            return await entities.CheckIn.find({
                date : { 
                    $gte: inputData.date1, 
                    $lte: inputData.date2
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    }
}