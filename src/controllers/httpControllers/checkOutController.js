const checkOutUseCases = require('../../use-cases/checkOutUseCases');

module.exports = {
    // Method = POST
    // Action = checkOut/new/checkIn/:checkIn/
    // Req.body = {checIn_id : ObjectId}
    new : async (req, res, next) => {
        const checkIn_id = req.body.checkIn_id;
        const savedObject = {};
        try {
            savedObject = await checkOutUseCases.newCheckOut({checkIn_id});   
            res.status(201).json(savedObject);
        } catch (error) { handlePostRequestError(error, res); }
    },
    // Method = GET
    // Action = checkOut/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await checkOutUseCases.getCheckOuts();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = checkOut/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const _id = req.params._id;
        try {
            const docs = await checkOutUseCases.getCheckOutsById({_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = checkOut/checkIn_id/:checkIn_id/
    // Params = {checkIn_id : ObjectId}
    getByCheckInId : async (req, res, next) => {
        const checkIn_id = req.params.checkIn_id;
        try {
            const doc = await checkOutUseCases.getCheckOutsByCheckInId({checkIn_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = checkOut/date1/:date1/date2/:date2
    // Params = {date1 : String, date2 : String}
    getByDateRange : async (req, res, next) => {
        const date1 = req.params.date1;
        const date2 = req.params.date2;
        try {
            const docs = await checkOutUseCases.getCheckOutsByDateRange({date1, date2});
            if(docs.length == 0) res.status(204).end();
        } catch (error) { handleGetRequestError(error, res); }
    }
}