const entities = require('../../entities/entities');
const {buildWaterConsumptionEntity} = require('../../entities/waterConsumptionEntity');

const handleError = (err) => {
    console.log(`An error has occured while tryng to performe a TowelConsumption model operation`);
    console.log(`Error: ${err}`);
};

module.exports = {
    saveDoc : async (message) => {
        const infoPacket = JSON.parse(message);
        // Search and assign sensor id based on sensor name
        const sensorObject = await entities.EspSensor.findOne({sensorName : infoPacket.sensorName}, '_id');
        //Build entity
        const finalObject = {'sensor_id' : sensorObject._id, infoPacket};
        const waterConsumptionDocument = buildWaterConsumptionEntity(Object.freeze(finalObject));
        //Save document
        waterConsumptionDocument.save((err) => {
            if(err) handleError(err);
        });
    },
    getDocs : async () => {
        const docs = await entities.WaterConsumption.find({});
        if(docs.length == 0) console.log(`Docs not found`);
        return docs;
    },
    getDocsByDate : async (date) => {
        const docs = await entities.WaterConsumption.find({date : date});
        if(docs.length == 0) console.log(`Docs not found according to input: ${date}`);
        return docs;
    },
    getDocsByDateRange : async (date1, date2) => {
        const docs = await entities.WaterConsumption.find({"infoPacket.date" : { $gte: date1, $lte: date2}});
        if(docs.length == 0) console.log(`Docs not found according to input: ${date}`);
        return docs;
    },
    getDocsBySensorName : async (sensorName) => {
        const docs = await entities.WaterConsumption.find({"infoPacket.sensorName" : sensorName});
        if(docs.length == 0) console.log(`Docs not found according to input: ${sensorName}`);
        return docs;
    }
};