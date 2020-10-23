const entities = require('../entities/entities');
const factories = require('../entities/factories');
const utils = require('../utils/utils');

const checkInUseCases = require('../use-cases/checkInUseCases');
const roomUseCases = require('../use-cases/roomUseCases');
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

        // Update associated room occupancy state
        let boundRoom = await roomUseCases.getRoomById({room_id : boundCheckIn.room_id});
        boundRoom.occupancyState = false;
        await boundRoom.save();

        let totalWater = await waterConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            boundCheckIn.room_id,
            boundCheckIn.date,
            now);

        let totalTowels = await towelConsumptionUseCases.getTotalConsumptionByPeriodAndRoomId(
            boundCheckIn.room_id,
            boundCheckIn.date,
            now);

        inputData.totalWaterConsumption = totalWater;
        inputData.totalTowelsConsumption = totalTowels;
        inputData.date = now;

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
        try { return await entities.CheckOut.findById(inputData._id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {checkIn_id : ObjectId}
    getCheckOutsByCheckInId : async (inputData) => {
        try { return await entities.CheckOut.findOne({checkIn_id : inputData.checkIn_id}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {date1 : Date, date2 : Date2}
    getCheckOutsByDateRange : async (inputData) => {
        try {
            return await entities.CheckOut.find({
                date : { 
                    $gte: inputData.date1, 
                    $lte: inputData.date2
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    }
}