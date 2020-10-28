const entities = require('../../entities/entities');
const utils = require('../../utils/utils');
const espSensorUseCases = require('../../use-cases/espSensorUseCases');

const {buildTowelConsumptionEntity} = require('../../entities/towelConsumptionEntity');
const {buildTotalTowelsConsumptionEntity} = require('../../entities/totalTowelsConsumptionEntity');

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
        const finalObject = {sensor_id : sensorObject._id, infoPacket};
        const towelConsumptionDocument = buildTowelConsumptionEntity(finalObject);
        //Save document
        towelConsumptionDocument.save((err, doc) => {
            if(err) handleError(err);
            else console.log(`Doc saved: ${doc}`);
        });
    },
    getDocs : async () => {
        const docs = await entities.TowelConsumption.find({});
        if(docs.length == 0) console.log(`Docs not found`);
        return docs;
    },
    getDocById : async (towelConsumption_id) => {
        const doc = await entities.TowelConsumption.findById(towelConsumption_id);
        if(utils.isEmpty(doc)) console.log(`Doc not found according to input: ${towelConsumption_id}`);
        return doc;
    },
    getDocsByDateRange : async (date1, date2) => {
        const docs = await entities.TowelConsumption.find({
            "infoPacket.date" : { $gte: date1, $lte: date2}
        });
        if(docs.length == 0) console.log(`Docs not found according to input: ${date1}, ${date2}`);
        return docs;
    },
    getDocsBySensorName : async (sensorName) => {
        const docs = await entities.TowelConsumption.find({"infoPacket.sensorName" : sensorName});
        if(docs.length == 0) console.log(`Docs not found according to input: ${sensorName}`);
        return docs;
    },
    // Count the total consumption measured by a sensor in a room for the given period of time
    getTotalConsumptionByPeriodAndRoomId : async (room_id, date1, date2) => {
        const espSensorDoc = await espSensorUseCases.getEspSensorByRoomId({room_id});
        const total = await entities.TowelConsumption.aggregate()
        .match({ $and : [
            {"infoPacket.sensorName" : espSensorDoc.sensorName},
            {"infoPacket.date" : { $gte: date1, $lte: date2}}
        ]})
        .group({
            _id : "$infoPacket.sensorName", 
            towels : {$sum : "$infoPacket.towels"},
            weight : {$sum : "$infoPacket.weight"},
            consumption : {$sum : "$infoPacket.consumption"}
        });
        console.log('Total towel consumption object: ');
        console.log(total);
        if(total.length > 0) return buildTotalTowelsConsumptionEntity(total[0]);
        return {};
    }
};