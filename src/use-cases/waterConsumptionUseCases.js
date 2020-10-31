const entities = require('../entities/entities');
const espSensorUseCases = require('./espSensorUseCases');
const {buildWaterConsumptionEntity} = require('../entities/waterConsumptionEntity');
const {buildTotalWaterConsumptionEntity} = require('../entities/totalWaterConsumptionEntity');

const handleError = (err) => {
    console.log(`An error has occured while tryng to performe a TowelConsumption model operation`);
    console.log(`Error: ${err}`);
};

module.exports = {
    newWaterConsumption : async (parsedMessage) => {
        try {
            const sensorName = parsedMessage.sensorName;
            const sensorDocument = await espSensorUseCases.getEspSensorByName({sensorName});
            const waterConsumptionDocument = buildWaterConsumptionEntity({
                sensor_id : sensorDocument._id,
                infoPacket : parsedMessage
            });
            return await waterConsumptionDocument.save();
        } 
        catch (error) { handleDBOperationError(error); }

    },
    getWaterConsumptions : async () => {
        const docs = await entities.WaterConsumption.find({});
        if(docs.length == 0) console.log(`Docs not found`);
        return docs;
    },
    getWaterConsumptionById : async (waterConsumption_id) => {
        const doc = await entities.WaterConsumption.findById(waterConsumption_id);
        if(utils.isEmpty(doc)) console.log(`Doc not found according to input: ${waterConsumption_id}`);
        return doc;
    },
    getWaterConsumptionsByDateRange : async (date1, date2) => {
        const docs = await entities.WaterConsumption.find({"infoPacket.date" : { $gte: date1, $lte: date2}});
        if(docs.length == 0) console.log(`Docs not found according to input: ${date}`);
        return docs;
    },
    getWaterConsumptionBySensorName : async (sensorName) => {
        const docs = await entities.WaterConsumption.find({"infoPacket.sensorName" : sensorName});
        if(docs.length == 0) console.log(`Docs not found according to input: ${sensorName}`);
        return docs;
    },
    // Count the total consumption measured by a sensor in a room for the given period of time
    getTotalConsumptionByPeriodAndRoomId : async (room_id, date1, date2) => {
        const espSensorDoc = await espSensorUseCases.getEspSensorByRoomId({room_id});
        const total = await entities.WaterConsumption.aggregate()
        .match({ $and : [
            {"infoPacket.sensorName" : espSensorDoc.sensorName},
            {"infoPacket.date" : { $gte: date1, $lte: date2}}
        ]})
        .group({
            _id : "$infoPacket.sensorName", 
            consumption : {$sum : "$infoPacket.consumption"},
            seconds : {$sum : "$infoPacket.seconds"}
        });
        if(total.length > 0) return buildTotalWaterConsumptionEntity(total[0]);
        return {};
    }
};