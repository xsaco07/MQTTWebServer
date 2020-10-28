const totalUseCases = require('../../use-cases/totalUseCases');
const {handleGetRequestError, handlePostRequestError} = require('../../utils/errorHandlers');

module.exports = {
    // Method = POST
    // Action = total/new/
    // Req.body = {checkIn_id: ObjectId}
    new : async (req, res, next) => {
        const totalDocument = req.body;
        try {
            const savedObject = await totalUseCases.newTotal(totalDocument);   
            res.status(201).json(savedObject);
        } catch (error) { handlePostRequestError(error, res); }
    },
    // Method = GET
    // Action = total/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await totalUseCases.getTotals();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = /total/_id/:_id/
    // Params =  {_id : ObjectId}
    getById : async (req, res, next) => {
        try {
            const _id = req.params._id;
            const doc = await totalUseCases.getTotalById({total_id : _id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = /total/checkIn_id/:checkIn_id/
    // Params =  {_id : ObjectId}
    getByCheckInId : async (req, res, next) => {
        try {
            const checkIn_id = req.params._id;
            const doc = await totalUseCases.getTotalByCheckInId({checkIn_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = /total/sensor_id/:sensor_id/
    // Params =  {_id : ObjectId}
    getBySensorId : async (req, res, next) => {
        try {
            const sensor_id = req.params._id;
            const doc = await totalUseCases.getTotalBySensorId({sensor_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    }
}