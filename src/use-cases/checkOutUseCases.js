const entities = require('../entities/entities');
const factories = require('../entities/factories');
const utils = require('../utils/utils');
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

        let now = new Date();
            now.setHours(now.getHours() - utils.offsetUTCHours);

        // Deactivate check-in and save
        let boundCheckIn = await checkInUseCases.getCheckInById({checkIn_id : inputData.checkIn_id});
        boundCheckIn.status = false;
        await boundCheckIn.save();

        let totalWater = await waterConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            boundCheckIn.room_id,
            boundCheckIn.date,
            now);

        console.log(totalWater);

        let totalTowels = await towelConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            boundCheckIn.room_id,
            boundCheckIn.date,
            now);

        console.log(totalTowels);
        
        if(totalWater.length == 0) totalWater = {};
        if(totalTowels.length == 0) totalTowels = {};

        inputData.totalWaterConsumption = totalWater;
        inputData.totalTowelsConsumption = totalTowels;
        inputData.date = now;

        const checkOutDocument = factories.buildCheckOutEntity(inputData);
        
        console.log(checkOutDocument);

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