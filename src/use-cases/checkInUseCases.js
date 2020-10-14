const entities = require('../entities/entities');
const factories = require('../entities/factories');

const handleSaveError = (err) => {
    console.log(`CheckIn Use Case`);
    console.log(`An error has occured while tryng to performe a CheckIn model operation`);
    console.log(`Error: ${err}`);
    throw new Error(err);
};

module.exports = {
    // inputData = {room_id : ObjectId, guest_id : ObjectId, days : int, nights : int, date : Date}
    newCheckIn = async (inputData) => {
        const duration = {days, nights};
        const finalObject = {
            room_id : inputData.room_id,
            guest_id : inputData.guest_id,
            duration,
            date
        };
        const checkInDocument = factories.buildCheckInEntity(finalObject);
        checkInDocument.save((err) => {
            handleSaveError(err);
        });
    },
    // inputData = {}
    getCheckIns = async () => {
        let docs = [];
        try {docs = await entities.CheckIn.find({});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
    // inputData = {room_id : ObjectId}
    getCheckInsByRoomId = async (inputData) => {
        let doc = {};
        try {doc = await entities.CheckIn.findById({room_id : inputData.room_id});}
        catch (error) {handleSaveError(error);}
        finally {return doc;}
    },
    // inputData = {days : int, nights : int}
    getCheckInsByDuration = async (inputData) => {
        let doc = {};
        try {doc = await entities.CheckIn.findById(
            {duration : {days : inputData.days, nights : inputData.nights}}
        );}
        catch (error) {handleSaveError(error);}
        finally {return doc;}
    },
    // inputData = {date1 : Date, date2 : Date2}
    getCheckInsByDate = async (inputData) => {
        let docs = [];
        try {docs = await entities.CheckIn.find({"infoPacket.date" : { $gte: date1, $lte: date2}});} 
        catch (error) {handleSaveError(error);}
        finally {return docs;}
    },
}