const towelUseCases = require('../../use-cases/towelConsumptionUseCases');
const {handleGetRequestError} = require('../../utils/errorHandlers');

module.exports = {
    // Method = GET
    // Action = towel_consumption/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await towelUseCases.getTowelConsumptions();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = /towel_consumption/_id/:_id/
    // Params =  {_id : ObjectId}
    getById : async (req, res, next) => {
        try {
            const _id = req.params._id;
            const doc = await towelUseCases.getTowelConsumptionById({_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = towel_consumption/date/:date1/:date2
    // Params = {date1 : String, date2 : String}
    getByDateRange : async (req, res, next) => {
        const date1 = req.params.date1;
        const date2 = req.params.date2;
        try {
            const docs = await towelUseCases.getTowelConsumptionsByDateRange({date1, date2});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = towel_consumption/sensor/:sensor_name/
    // Params = {sensor_name : String}
    getBySensorName : async (req, res, next) => {
        const sensorName = req.params.sensor_name;
        try {
            const docs = await towelUseCases.getTowelConsumptionsBySensorName({sensorName});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = towel_consumption/total/room_id/:room_id/date/:date1/:date2
    // Params = {room_id : ObjectId, date1 : String, date2 : String}
    getTotalByRoomAndDate : async (req, res, next) => {
        const room_id = req.params.room_id;
        const date1 = req.params.date1;
        const date2 = req.params.date2;
        try {
            const doc = await towelUseCases.getTotalConsumptionByPeriodAndRoomId({
                room_id,
                date1,
                date2
            });
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = towel_consumption/guest/
    // Params = {}
    getConsumptionForAllGuests : async (req, res, next) => {
        try {
            const docs = await towelUseCases.getConsumptionForAllGuests();
            if(Object.keys(docs).length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = towel_consumption/day/
    // Params = {}
    getConsumptionByDay : async (req, res, next) => {
        try {
            const docs = await towelUseCases.getConsumptionByDay();
            if(docs == null || Object.keys(docs).length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = towel_consumption/hour/:date
    // Params = {}
    getConsumptionByHour : async (req, res, next) => {
        try {
            const date = req.params.date;
            const docs = await towelUseCases.getConsumptionByHour({date});
            if(docs == null || Object.keys(docs).length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    }
}