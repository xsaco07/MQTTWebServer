const entities = require('../entities/entities');
const factories = require('../entities/factories');

const handleDBOperationError = (err) => {
    console.log(`Total Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {checkIn_id : ObjectId, sensor_id : ObjectId}
    newTotal : async (inputData) => {
        // Just need check In id because the other values by default should start in 0
        const totalDocument = factories.buildTotalEntity({
            checkIn_id : inputData.checkIn_id,
            sensor_id : inputData.sensor_id
        });
        try { return await totalDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getTotals : async () => {
        try { 
            return await entities.Total.find({}).
            populate({
                path : 'checkIn_id',
                populate : {
                    path : 'room_id',
                    select : 'roomNumber capacity -_id'
                },
                select : '-_id -__v'
            }).
            populate({
                path : 'checkIn_id',
                populate : {
                    path : 'guest_id',
                    select : 'age country -_id'
                },
                select : '-_id -__v'
            }).
            select('-_id -__v').
            exec(); 
        } 
        catch (error) { handleDBOperationError(error); }
    },
    getTotalsByGuest : async () => {
        try { 
            return await entities.Total.find({}, 'totals').
            populate({
                path : 'checkIn_id',
                populate : {
                    path : 'guest_id',
                    select : 'age country'
                },
                select : 'guest_id'
            }).
            exec(); 
        } 
        catch (error) { handleDBOperationError(error); }
    },
    getTotalsByRoom : async () => {
        try { 
            return await entities.Total.find({}, 'totals').
            populate({
                path : 'checkIn_id',
                populate : {
                    path : 'room_id',
                    select : 'roomNumber'
                },
                select : 'room_id'
            }).
            exec(); 
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {total_id : ObjectId}
    getTotalById : async (inputData) => {
        try { return await entities.Total.findById(inputData.total_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {checkIn_id : ObjectId}
    getTotalByCheckInId : async (inputData) => {
        try { return await entities.Total.findOne({checkIn_id : inputData.checkIn_id});} 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {sensor_id : ObjectId}
    getTotalBySensorId : async (inputData) => {
        try { return await entities.Total.find({sensor_id : inputData.sensor_id});} 
        catch (error) { handleDBOperationError(error); }
    },
}