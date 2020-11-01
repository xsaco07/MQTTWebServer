const entities = require('../entities/entities');
const espSensorUseCases = require('./espSensorUseCases');
const constants = require('../utils/constants');
const utils = require('../utils/utils');
const {buildTowelConsumptionEntity} = require('../entities/towelConsumptionEntity');
const {buildTotalTowelsConsumptionEntity} = require('../entities/totalTowelsConsumptionEntity');

const handleDBOperationError = (err) => {
    console.log(`Towel Consumption Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    newTowelConsumption : async (parsedMessage) => {
        try {
            const sensorName = parsedMessage.sensorName;
            const sensorDocument = await espSensorUseCases.getEspSensorByName({sensorName});
            const towelConsumptionObject = buildTowelConsumptionEntity({
                sensor_id : sensorDocument._id,
                infoPacket : parsedMessage
            });
            return await towelConsumptionObject.save();
        } 
        catch (error) { handleDBOperationError(error); }

    },
    // inputData = {}
    getTowelConsumptions : async () => {
        try { return await entities.TowelConsumption.find({});} 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {_id : ObjectId}
    getTowelConsumptionById : async (infoPacket) => {
        try { return await entities.TowelConsumption.findById(infoPacket._id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {date1 : Date, date2 : Date}
    getTowelConsumptionsByDateRange : async (inputData) => {
        try { 
            return await entities.TowelConsumption.find({
                "infoPacket.date" : { $gte: inputData.date1, $lte: inputData.date2}
            });
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {sensorName : String}
    getTowelConsumptionsBySensorName : async (inputData) => {
        try {
            return await entities.TowelConsumption.find({
                "infoPacket.sensorName" : inputData.sensorName
            });
        } catch (error) { handleDBOperationError(error); }
    },
    // Count the total consumption measured by a sensor in a room for the given period of time
    // inputData = {room_id : ObjectId, date1 : Date, date2 : Date}
    getTotalConsumptionByPeriodAndRoomId : async (inputData) => {
        try {
            const espSensorDoc = await espSensorUseCases.getEspSensorByRoomId(
                {room_id : inputData.room_id}
            );
            const total = await entities.TowelConsumption.aggregate()
            .match({ $and : [
                {"infoPacket.sensorName" : espSensorDoc.sensorName},
                {"infoPacket.date" : { 
                    $gte: new Date(inputData.date1), 
                    $lte: new Date(inputData.date2)
                }}
            ]})
            .group({
                _id : "$infoPacket.sensorName", 
                towels : {$sum : "$infoPacket.towels"},
                weight : {$sum : "$infoPacket.weight"},
                consumption : {$sum : "$infoPacket.consumption"}
            });
            if(total.length > 0) return buildTotalTowelsConsumptionEntity(total[0]);
            return null;
        } catch (error) { handleDBOperationError(error); }
    },
    // Returns a list of every guest 
    // inputData = {}
    getConsumptionForAllGuests : async () => {
        
        try {

            let result = {};
            
            // Get all towelConsumptions registered
            const towelConsumptions = await entities.TowelConsumption.find({}, 'sensor_id infoPacket');
            
            await Promise.all(towelConsumptions.map(async (doc) => {

                // Get the respective room_id for the towelConsumption from the EspSensor
                const sensorDoc = await entities.EspSensor.findById(doc.sensor_id, 'room_id');

                // Get the respective CheckIn document based on the closest-smaller-date and room_id
                const checkInDoc = await entities.CheckIn.findOne({
                    room_id : sensorDoc.room_id,
                    date : {$lt : doc.infoPacket.date}
                }, 'guest_id').sort({date : 'desc'}).limit(1);

                // Get the guest data using CheckIn guest_id exluding the db id
                const guestDoc = await entities.Guest.findById(checkInDoc.guest_id, 'country age');

                // For each guest save the consumption
                if(result[guestDoc._id] == null) {
                    result[guestDoc._id] = {
                        guest : guestDoc,
                        towels : doc.infoPacket.towels,
                        consumption : doc.infoPacket.consumption
                    };
                }
                else {
                    result[guestDoc._id].consumption += doc.infoPacket.consumption;
                    result[guestDoc._id].towels += doc.infoPacket.towels;
                } 
                
            }));

            return result;

        } catch (error) { handleDBOperationError(error); }
    },

    // Returns towel consumptions by day for the last utils.LAST_DAYS days
    // inputData = {}
    getConsumptionByDay : async () => {
        try {

            // start by getting current date
            let date1 = new Date();
            // set date to midnight
            date1.setHours(24,0,0,0);
            // substract N days
            date1.setDate(date1.getDate() - constants.LAST_DAYS);

            // start by getting current date
            let date2 = new Date();
            // set date to midnight
            date2.setHours(24,0,0,0);

            const total = await entities.TowelConsumption.aggregate()
            .match({"infoPacket.date" : { $gte: date1, $lt: date2}})
            .group({
                // Each row will be grouped by the day
                _id : { $dateToString: { format: "%Y-%m-%d", date: "$infoPacket.date" } }, 
                towels : {$sum : "$infoPacket.towels"},
                weight : {$sum : "$infoPacket.weight"},
                consumption : {$sum : "$infoPacket.consumption"}
            });
            if(total.length > 0) return total;
            return null;
        } catch (error) { handleDBOperationError(error); }   
    }


};