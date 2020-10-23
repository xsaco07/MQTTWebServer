const entities = require('../../entities/entities');
const espSensorUseCases = require('../../use-cases/espSensorUseCases');
const {buildWaterConsumptionEntity} = require('../../entities/waterConsumptionEntity');
const {buildTotalWaterConsumptionEntity} = require('../../entities/totalWaterConsumptionEntity');

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
        waterConsumptionDocument.save((err, doc) => {
            if(err) handleError(err);
            else console.log(`Doc saved: ${doc}`);
        });
    },
    getDocs : async () => {
        const docs = await entities.WaterConsumption.find({});
        if(docs.length == 0) console.log(`Docs not found`);
        return docs;
    },
    getDocById : async (waterConsumption_id) => {
        const doc = await entities.WaterConsumption.findById(waterConsumption_id);
        if(utils.isEmpty(doc)) console.log(`Doc not found according to input: ${waterConsumption_id}`);
        return doc;
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
    },
    // Count the total consumption measured by a sensor in a room for the given period of time
    // That period of time is defined by the check-in date and the check-out date
    getTotalConsumptionByPeriodAndRoomId : async (room_id, checkInDate, checkOutDate) => {
        const espSensorDoc = await espSensorUseCases.getEspSensorByRoomId({room_id});
        const total = await entities.WaterConsumption.aggregate()
        .match({ $and : [
            {"infoPacket.sensorName" : espSensorDoc.sensorName},
            {date : { $gte: checkInDate, $lte: checkOutDate}}
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