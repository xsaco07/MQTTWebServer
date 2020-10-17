const entities = require('../entities/entities');
const factories = require('../entities/factories');
const checkInUseCases = require('../use-cases/checkInUseCases');
const towelConsumptionUseCases = require('../controllers/mqttControllers/towelConsumptionController');
const waterConsumptionUseCases = require('../controllers/mqttControllers/waterConsumptionController');

const handleSaveError = (err) => {
    console.log(`CheckOut Use Case`);
    console.log(`An error has occured while tryng to performe a CheckOut model operation`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {checkIn_id : ObjectId, date : Date}
    newCheckOut : async (inputData) => {
        const boundCheckIn = checkInUseCases.getCheckInById(inputData.checkIn_id);
        const totalWaterConsumption = 
            waterConsumptionUseCases.getTotalWaterConsumptionByRoomId(boundCheckIn.room_id);
        const totalTowelsConsumption = 
            towelConsumptionUseCases.getTotalTowelsConsumptionByRoomId(boundCheckIn.room_id);

        inputData.totalWaterConsumption = totalWaterConsumption;
        inputData.totalTowelsConsumption = totalTowelsConsumption;

        const checkOutDocument = factories.buildCheckOutEntity(finalObject);
        checkOutDocument.save((err) => {
            handleSaveError(err);
        });
    },
    // inputData = {}
    getCheckOuts : async () => {
        let docs = [];
        try {docs = await entities.CheckOut.find({});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData = {checkIn_id : ObjectId}
    getCheckOutsByCheckInId : async (inputData) => {
        let doc = {};
        try {doc = await entities.CheckIn.find({checkIn_id : inputData.checkIn_id});}
        catch (error) {handleSaveError(error);}
        finally {return doc[0];}
    },
    // inputData = {date1 : Date, date2 : Date2}
    getCheckOutsByDate : async (inputData) => {
        let docs = [];
        try {docs = await entities.CheckIn.find({date : { $gte: date1, $lte: date2}});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
}