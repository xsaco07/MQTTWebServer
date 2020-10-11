const {buildWaterConsumptionEntity, WaterConsumption} = require('../../entities/waterConsumptionEntity');

module.exports = {
    saveDoc : async (message) => {
        const object = Object.freeze(JSON.parse(message));
        const waterConsumptionDocument = buildWaterConsumptionEntity(object);
        await waterConsumptionDocument.save((error) => {
            console.log(`An error has occured while saving the waterConsumptionDocument`);
            console.log(`Error: ${error}`);
        });
    },
    getDocs : async () => {
        const docs = await WaterConsumption.find({});
        if(docs.length == 0) console.log(`Docs not found`);
        return docs;
    },
    getDocsByDate : async (date) => {
        const docs = await WaterConsumption.find({date : date});
        if(docs.length == 0) console.log(`Docs not found according to input: ${date}`);
        return docs;
    },
    getDocsByDateRange : async (date1, date2) => {
        const docs = await WaterConsumption.find({date: { $gte: date1, $lte: date2 }});
        if(docs.length == 0) console.log(`Docs not found according to input: ${date}`);
        return docs;
    },
    getDocsBySensorName : async (sensorName) => {
        const docs = await WaterConsumption.find({infoPacket : {sensorName : sensorName}});
        if(docs.length == 0) console.log(`Docs not found according to input: ${sensorName}`);
        return docs;
    }
};