const {handleGetRequestError, handlePostRequestError} = require('../../utils/errorHandlers');
const userUseCases = require('../../use-cases/userUseCases');

module.exports = {
    // Method = POST
    // Action = user/new/
    // Req.body = {userName : String
    //              password : String,
    //              name : String,
    //              lastName1 : String,
    //              lastName2 : String,
    //              email : String}
    new : async (req, res, next) => {
        const userInfo = req.body;
        try {
            const savedObject = await userUseCases.newUser(userInfo);   
            res.status(201).json(savedObject);
        } catch (error) { handlePostRequestError(error, res); }
    },
    // Method = GET
    // Action = user/
    // Params = {}
    getAll : async (req, res, next) => {
        try {
            const docs = await userUseCases.getUsers();
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = user/_id/:_id/
    // Params = {_id : ObjectId}
    getById : async (req, res, next) => {
        const user_id = req.params._id;
        try {
            const doc = await userUseCases.getUserById({user_id: user_id});
            if(doc == null) res.status(204).end();
            else res.status(200).json(doc);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = user/name/:name/lastName1/:lastname1/lastName2/:lastname2
    // Params = {name : String, lastName2 : Strin, lastName2 : String}
    getByFullName : async (req, res, next) => {
        const fullName = {
            name : req.params.name,
            lastName1 : req.params.lastName1,
            lastName2 : req.params.lastName2
        };
        try {
            const docs = await userUseCases.getUserByFullName(fullName);
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    },
    // Method = GET
    // Action = user/userName/:userName/
    // Params = {age : int}
    getByUserName : async (req, res, next) => {
        const userName = req.params.userName;
        try {
            const docs = await userUseCases.getUserByUserName({userName});
            if(docs.length == 0) res.status(204).end();
            else res.status(200).json(docs);
        } catch (error) { handleGetRequestError(error, res); }
    }
}