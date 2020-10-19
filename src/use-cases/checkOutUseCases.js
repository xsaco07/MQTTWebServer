const entities = require('../entities/entities');
const factories = require('../entities/factories');
const checkInUseCases = require('../use-cases/checkInUseCases');
const towelConsumptionUseCases = require('../controllers/mqttControllers/towelConsumptionController');
const waterConsumptionUseCases = require('../controllers/mqttControllers/waterConsumptionController');

const handleDBOperationError = (err) => {
    console.log(`CheckOut Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {checkIn_id : ObjectId}
    newCheckOut : async (inputData) => {
        const boundCheckIn = checkInUseCases.getCheckInById(inputData.checkIn_id);
        const totalWater = waterConsumptionUseCases.getTotalConsumptionByRoomId(boundCheckIn.room_id);
        const totalTowels = towelConsumptionUseCases.getTotalConsumptionByRoomId(boundCheckIn.room_id);

        inputData.totalWaterConsumption = totalWater;
        inputData.totalTowelsConsumption = totalTowels;

        const checkOutDocument = factories.buildCheckOutEntity(inputData);

        try { return await checkOutDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getCheckOuts : async () => {
        try { return await entities.CheckOut.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {_id : ObjectId}
    getCheckOutsById : async (inputData) => {
        try { return await entities.CheckIn.findById(inputData._id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {checkIn_id : ObjectId}
    getCheckOutsByCheckInId : async (inputData) => {
        try { return await entities.CheckIn.findOne({checkIn_id : inputData.checkIn_id}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {date1 : Date, date2 : Date2}
    getCheckOutsByDateRange : async (inputData) => {
        try {
            await entities.CheckIn.find({
                date : { $gte: inputData.date1, $lte: inputData.date2}
            });
        } 
        catch (error) { handleDBOperationError(error); }
    }
}