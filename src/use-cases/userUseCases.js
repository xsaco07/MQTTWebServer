const entities = require('../entities/entities');
const factories = require('../entities/factories');

// For password encryption
const bcrypt = require('bcrypt');

const handleDBOperationError = (err) => {
    console.log(`Guest Use Case`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {userName : String
    //              password : String,
    //              name : String,
    //              lastName1 : String,
    //              lastName2 : String,
    //              email : String}
    newUser : async (inputData) => {

        const hashedPassword = await bcrypt.hash(inputData.password, 10)

        const finalObject = Object.freeze({
            userName : inputData.userName,
            password : hashedPassword,
            fullName : {
                name : inputData.name, 
                lastName1 : inputData.lastName1,
                lastName2 : inputData.lastName2
            },
            email : inputData.email,
        });
        const userDocument = factories.buildUserEntity(finalObject);
        try { return await userDocument.save(); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {}
    getUsers : async () => {
        try { return await entities.User.find({}); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {user_id : ObjectId}
    getUserById : async (inputData) => {
        try { return await entities.User.findById(inputData.user_id); } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {name : String, lastName1 : String, lastName2 : String}
    getUserByFullName : async (inputData) => {
        try { 
            return await entities.User.find({
                fullName : {
                    name : inputData.name,
                    lastName1 : inputData.lastName1,
                    lastName2 : inputData.lastName2
                }
            });
        } 
        catch (error) { handleDBOperationError(error); }
    },
    // inputData = {userName : String}
    getUserByUserName : async (inputData) => {
        try { return await entities.User.findOne({userName : inputData.userName}); } 
        catch (error) { handleDBOperationError(error); }
    }
}