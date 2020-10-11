const entities = require('../../entities/entities');

const {buildTowelConsumptionEntity} = require('../../entities/towelConsumptionEntity');

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
        const towelConsumptionDocument = buildTowelConsumptionEntity(Object.freeze(finalObject));
        //Save document
        towelConsumptionDocument.save((err) => {
            if(err) handleError(err);
        });
    },
    getDocs : async () => {
        const docs = await entities.TowelConsumption.find({});
        if(docs.length == 0) console.log(`Docs not found`);
        return docs;
    },
    getDocsByDateRange : async (date1, date2) => {
        const docs = await entities.TowelConsumption.find({"infoPacket.date" : { $gte: date1, $lte: date2}});
        if(docs.length == 0) console.log(`Docs not found according to input: ${date1}, ${date2}`);
        return docs;
    },
    getDocsBySensorName : async (sensorName) => {
        const docs = await entities.TowelConsumption.find({"infoPacket.sensorName" : sensorName});
        if(docs.length == 0) console.log(`Docs not found according to input: ${sensorName}`);
        return docs;
    }
};