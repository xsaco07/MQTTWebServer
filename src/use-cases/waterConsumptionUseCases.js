const entities = require('../entities/entities');
const espSensorUseCases = require('./espSensorUseCases');
const roomUseCases = require('../use-cases/roomUseCases');
const utils = require('../utils/utils');
const constants = require('../utils/constants');
const {buildWaterConsumptionEntity} = require('../entities/waterConsumptionEntity');
const {buildTotalWaterConsumptionEntity} = require('../entities/totalWaterConsumptionEntity');

const handleDBOperationError = (err) => {
    console.log(`Water Consumption Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

const addRoomDataToResult = (waterConsumptionDoc, roomDoc, result) => {
    if(result[roomDoc.roomNumber] == null) {
        result[roomDoc.roomNumber] = {
            consumption : waterConsumptionDoc.infoPacket.consumption,
            seconds : waterConsumptionDoc.infoPacket.seconds,
            occupancyState : roomDoc.occupancyState,
            capacity : roomDoc.capacity
        };
    }
    else {
        result[roomDoc.roomNumber].consumption += waterConsumptionDoc.infoPacket.consumption;
        result[roomDoc.roomNumber].seconds += waterConsumptionDoc.infoPacket.seconds;
    } 
};

module.exports = {
    newWaterConsumption : async (parsedMessage) => {
        try {
            const sensorName = parsedMessage.sensorName;
            const sensorDocument = await espSensorUseCases.getEspSensorByName({sensorName});
            const roomDocument = await roomUseCases.getRoomById({room_id : sensorDocument.room_id});
            // Validate if room is active
            const expected = (roomDocument.occupancyState == true) ? true : false;
            const waterConsumptionDocument = buildWaterConsumptionEntity({
                sensor_id : sensorDocument._id,
                infoPacket : parsedMessage,
                expected
            });
            return await waterConsumptionDocument.save();
        } 
        catch (error) { handleDBOperationError(error); }

    },
    // inputData = {}
    getWaterConsumptions : async () => {
        try { return await entities.WaterConsumption.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {_id : ObjectId}
    getWaterConsumptionById : async (inputData) => {
        try { return await entities.WaterConsumption.findById(inputData.waterConsumption_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {date1 : Date, date2 : Date}
    getWaterConsumptionsByDateRange : async (inputData) => {
        try { 
            return await entities.WaterConsumption.find({
                "infoPacket.date" : { $gte: inputData.date1, $lte: inputData.date2}
            });
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {sensorName : String}
    getWaterConsumptionBySensorName : async (inputData) => {
        try {
            return await entities.WaterConsumption.find({
                "infoPacket.sensorName" : inputData.sensorName
            });
        } catch (error) { handleDBOperationError(error); }
    },
    // inputData = {expected : Boolean}
    getWaterConsumptionsByExpectedState : async (inputData) => {
        try {
            return await entities.WaterConsumption.find({expected : inputData.expected}).
            populate({
                path : 'sensor_id',
                populate : {
                    path : 'room_id',
                    select : 'roomNumber'
                },
                select : 'infoPacket sensorName'
            }).
            exec();
        } catch (error) { handleDBOperationError(error); }
    },
    // Count the total expected consumption measured by a sensor in a room for the given period of time
    // inputData = {room_id : ObjectId, date1 : Date, date2 : Date}
    getTotalConsumptionByPeriodAndRoomId : async (inputData) => {
        try {
            const espSensorDoc = await espSensorUseCases.getEspSensorByRoomId(
                {room_id : inputData.room_id}
            );
            const total = await entities.WaterConsumption.aggregate()
            .match({ $and : [
                {"infoPacket.sensorName" : espSensorDoc.sensorName},
                {"infoPacket.date" : { 
                    $gte: new Date(inputData.date1), 
                    $lte: new Date(inputData.date2)
                }},
                {expected : true}
            ]})
            .group({
                _id : "$infoPacket.sensorName", 
                consumption : {$sum : "$infoPacket.consumption"},
                seconds : {$sum : "$infoPacket.seconds"}
            });
            if(total.length > 0) return buildTotalWaterConsumptionEntity(total[0]);
            return null;
        } catch (error) { handleDBOperationError(error); }
    },
    // Returns a list of expected water consumption for every guest 
    // inputData = {}
    getConsumptionForAllGuests : async () => {
        
        try {

            let result = {};
            
            // Get all towelConsumptions registered and expected
            const waterConsumptions = await entities.WaterConsumption.find(
                {expected : true}, 
                'sensor_id infoPacket'
            );
            
            await Promise.all(waterConsumptions.map(async (doc) => {

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
                        seconds : doc.infoPacket.seconds,
                        consumption : doc.infoPacket.consumption
                    };
                }
                else {
                    result[guestDoc._id].consumption += doc.infoPacket.consumption;
                    result[guestDoc._id].seconds += doc.infoPacket.seconds;
                } 
                
            }));

            return result;

        } catch (error) { handleDBOperationError(error); }
    },
    // Returns expected water consumptions by day for the last utils.LAST_DAYS days
    // inputData = {}
    getConsumptionByDay : async (inputData) => {
        try {

            let queryFilter = {};
            if(inputData.days != null){
                // get current date
                let date1 = new Date();
                // substract N days
                date1.setDate(date1.getDate() - inputData.days);
                // set date to midnight
                date1.setHours(24,0,0,0);
                // align with time zone offset
                date1.setHours(date1.getHours() - utils.offsetUTCHours);

                // get current date
                let date2 = new Date();
                // set date to midnight
                date2.setHours(24,0,0,0);
                // align with time zone offset
                date2.setHours(date2.getHours() - utils.offsetUTCHours);

                queryFilter = {"infoPacket.date" : { $gte: date1, $lt: date2}};
            }

            const total = await entities.WaterConsumption.aggregate()
            .match({ $and : [queryFilter,{expected : true}]})
            .group({
                // Each row will be grouped by the day
                _id : { $dateToString: { format: "%Y-%m-%d", date: "$infoPacket.date" } }, 
                consumption : {$sum : "$infoPacket.consumption"},
                seconds : {$sum : "$infoPacket.seconds"}
            });
            if(total.length > 0) return total;
            return null;
        } catch (error) { handleDBOperationError(error); }   
    },
    // Returns expected water consumptions by day for the last utils.LAST_DAYS days
    // starting from a specific date
    // inputData = {}
    getConsumptionByDaySince : async (inputData) => {
        try {

            let queryFilter = {};
            // get current date
            let date1 = new Date(inputData.lastDate);
            // set date to midnight
            date1.setHours(48,0,0,0);
            // align with time zone offset
            date1.setHours(date1.getHours() - utils.offsetUTCHours);
            // substract N days
            date1.setDate(date1.getDate() - inputData.days);

            // get current date
            let date2 = new Date(inputData.lastDate);
            // set date to midnight
            date2.setHours(48,0,0,0);
            // align with time zone offset
            date2.setHours(date2.getHours() - utils.offsetUTCHours);

            queryFilter = {"infoPacket.date" : { $gte: date1, $lt: date2}};

            const total = await entities.WaterConsumption.aggregate()
            .match({ $and : [queryFilter,{expected : true}]})
            .group({
                // Each row will be grouped by the day
                _id : { $dateToString: { format: "%Y-%m-%d", date: "$infoPacket.date" } }, 
                consumption : {$sum : "$infoPacket.consumption"},
                seconds : {$sum : "$infoPacket.seconds"}
            });
            if(total.length > 0) return total;
            return null;
        } catch (error) { handleDBOperationError(error); }   
    },
    // Returns expected water consumptions by hour for specific day
    // inputData = {date : Date}
    getConsumptionByHour : async (inputData) => {
        
        try {

            // get current date
            let date1 = new Date(inputData.date);
            // set date to midnight
            date1.setHours(24,0,0,0);
            // align with time zone offset
            date1.setHours(date1.getHours() - utils.offsetUTCHours);

            // get current date
            let date2 = new Date(inputData.date);
            // substract N days
            date2.setDate(date2.getDate() + 1);
            // set date to midnight
            date2.setHours(24,0,0,0);
            // align with time zone offset
            date2.setHours(date2.getHours() - utils.offsetUTCHours);

            const total = await entities.WaterConsumption.aggregate()
            .match({ $and : [
                {"infoPacket.date" : { $gte: date1, $lt: date2}},
                {expected : true}
            ]})
            .group({
                // Each row will be grouped by the day
                _id : { $dateToString: { format: "%H", date: "$infoPacket.date" } }, 
                consumption : {$sum : "$infoPacket.consumption"},
                seconds : {$sum : "$infoPacket.seconds"}
            });
            if(total.length > 0) return total;
            return null;
            
        } catch (error) { handleDBOperationError(error); }   
    },
    // inputData = {} to get total expected water consumption by room
    // inputData = {state : boolean (true)} to get expected water consumption for active rooms
    // inputData = {state : boolean (false)} to get expected water consumption for inactive rooms
    getConsumptionByRoom : async (inputData) => {
        
        try {

            let result = {};

            let state = (inputData.state != null ) ? (inputData.state == 'true') : null;
            
            // Get all expected waterConsumptions registered
            const waterConsumptions = await entities.WaterConsumption.find(
                {expected : true}, 
                'sensor_id infoPacket');
            
            await Promise.all(waterConsumptions.map(async (doc) => {

                // Get the respective room_id for the waterConsumption from the EspSensor
                const sensorDoc = await entities.EspSensor.findById(doc.sensor_id, 'room_id');

                // Get the respective Room
                const roomDoc = await entities.Room.findById(sensorDoc.room_id, 'roomNumber occupancyState');
                
                // For each room save the consumption
                // Count just active rooms
                if(state) {
                    if(roomDoc.occupancyState) addRoomDataToResult(doc, roomDoc, result);
                }
                // Count just inactive rooms
                else if(state == false) {
                    if(!roomDoc.occupancyState) addRoomDataToResult(doc, roomDoc, result);
                }
                // Count all rooms
                else {
                    addRoomDataToResult(doc, roomDoc, result);
                }
                
            }));

            return result;

        } catch (error) { handleDBOperationError(error); }
    },
    // Returns total conumption by room for current check in
    // inputData = {}
    getCurrentConsumptionByRoom : async () => {
        
        try {

            let result = {};
            
            // Get all towelConsumptions registered
            const towelConsumptions = await entities.WaterConsumption.find(
                {expected : true}, 
                'sensor_id infoPacket');
            
            await Promise.all(towelConsumptions.map(async (doc) => {

                // Get the respective room_id for the towelConsumption from the EspSensor
                const sensorDoc = await entities.EspSensor.findById(doc.sensor_id, 'room_id');
                
                // Get the respective Room
                const roomDoc = await entities.Room.findById(sensorDoc.room_id, 
                    'roomNumber capacity occupancyState'
                );
                
                // Get the respective CheckIn document based on the closest-smaller-date and room_id
                const checkInDoc = await entities.CheckIn.findOne({
                    room_id : roomDoc._id,
                    date : {$lt : doc.infoPacket.date}
                }, 'date status').sort({date : 'desc'}).limit(1);

                // Consider just consumption for an active checkIn
                if(roomDoc.occupancyState && checkInDoc.status) {
                    addRoomDataToResult(doc, roomDoc, result);
                }
                
            }));

            return result;

        } catch (error) { handleDBOperationError(error); }
    },
    metrics : {
        totalConsumption : async() => {
            return await entities.WaterConsumption.aggregate()
            .group({
                _id : null,
                consumption : {$sum : "$infoPacket.consumption"},
                seconds : {$sum : "$infoPacket.seconds"}
            });
        }
    }
};