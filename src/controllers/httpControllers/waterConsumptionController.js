const waterUseCases = require('../../use-cases/waterConsumptionUseCases');
const {handleGetRequestError} = require('../../utils/errorHandlers');

module.exports = {
    // Method = GET
    // Action = water_consumption/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await waterUseCases.getWaterConsumptions();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = /water_consumption/_id/:_id/
    // Params =  {_id : ObjectId}
    getById : async (req, res, next) => {
        try {
            const _id = req.params._id;
            const doc = await waterUseCases.getWaterConsumptionById({_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = water_consumption/date/:date1/:date2
    // Params = {date1 : String, date2 : String}
    getByDateRange : async (req, res, next) => {
        const date1 = req.params.date1;
        const date2 = req.params.date2;
        try {
            const docs = await waterUseCases.getWaterConsumptionsByDateRange({date1, date2});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = water_consumption/sensor/:sensor_name/
    // Params = {sensor_name : String}
    getBySensorName : async (req, res, next) => {
        const sensorName = req.params.sensor_name;
        try {
            const docs = await waterUseCases.getWaterConsumptionBySensorName({sensorName});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = water_consumption/total/room_id/:room_id/date/:date1/:date2
    // Params = {room_id : ObjectId, date1 : String, date2 : String}
    getTotalByRoomAndDate : async (req, res, next) => {
        const room_id = req.params.room_id;
        const date1 = req.params.date1;
        const date2 = req.params.date2;
        try {
            const doc = await waterUseCases.getTotalConsumptionByPeriodAndRoomId({
                room_id,
                date1,
                date2
            });
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = water_consumption/guest/
    // Params = {}
    getConsumptionForAllGuests : async (req, res, next) => {
        try {
            const docs = await waterUseCases.getConsumptionForAllGuests();
            if(Object.keys(docs).length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = water_consumption/day/
    // Params = {}
    getConsumptionByDay : async (req, res, next) => {
        try {
            const docs = await waterUseCases.getConsumptionByDay();
            if(docs == null || Object.keys(docs).length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = water_consumption/hour/:date
    // Params = {}
    getConsumptionByHour : async (req, res, next) => {
        try {
            const date = req.params.date;
            const docs = await waterUseCases.getConsumptionByHour({date});
            if(docs == null || Object.keys(docs).length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action1 = water_consumption/room/
    // Action2 = water_consumption/room/:state/
    // Params1 = {}
    // Params2 = {state : boolean}
    getConsumptionByRoom : async (req, res, next) => {
        try {
            const docs = await waterUseCases.getConsumptionByRoom(req.params);
            if(docs == null || Object.keys(docs).length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    }
}