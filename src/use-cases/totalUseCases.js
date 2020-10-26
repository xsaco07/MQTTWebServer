const entities = require('../entities/entities');
const factories = require('../entities/factories');

const handleDBOperationError = (err) => {
    console.log(`Total Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {checkIn_id : ObjectId}
    newTotal : async (inputData) => {
        // Just need check In id because the other values by default should start in 0
        const totalDocument = factories.buildTotalEntity({checkIn_id : inputData.checkIn_id});
        try { return await totalDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getTotals : async () => {
        try { return await entities.Total.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {total_id : ObjectId}
    getTotalById : async (inputData) => {
        try { return await entities.Total.findById(inputData.total_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {checkIn_id : ObjectId}
    getTotalByCheckInId : async (inputData) => {
        try { return await entities.Total.find({checkIn_id : inputData.checkIn_id});} 
        catch (error) { handleDBOperationError(error); }
    },
}