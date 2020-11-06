const makeDB = require('./mongodb');

const {buildCheckInEntity, CheckIn} = require('../entities/checkInEntity');
const {buildRoomEntity, Room} = require('../entities/roomEntity');
const {buildEspSensorEntity, EspSensor} = require('../entities/espSensorEntity');

makeDB()
.then(() => {console.log(`Database connection success!`);})
.catch((err) => {console.log(`An error has occured: ${err}`);});

const saveRooms = async () => {
    for(let i = 1; i < 6; i++){
        const roomDoc = await Room.findOne({roomNumber : i});
        const espSensorObj = buildEspSensorEntity({
            sensorName : `ESPSensor0${i}`,
            state : true,
            room_id : roomDoc._id
        });
        await espSensorObj.save((err) => {
            if(err) console.log(`An error has occured: ${err}`);
            else console.log(`Document saved: ${espSensorObj._id}`);
        });
    }    
}

const checkInDocument = buildCheckInEntity({
    room_id : roomDocument._id,
    duration : {
        days : 1,
    },
    date : Date.now()
});

checkInDocument.save((err) => {
    if(err) console.log(`An error has occured: ${err}`);
    else console.log(`Document saved: ${checkInDocument._id}`);
});


