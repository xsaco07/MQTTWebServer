const makeDB = require('./mongodb');

const {buildCheckInEntity, CheckIn} = require('../entities/checkInEntity');
const {buildRoomEntity, Room} = require('../entities/roomEntity');

makeDB()
.then(() => {console.log(`Database connection success!`);})
.catch((err) => {console.log(`An error has occured: ${err}`);});

const roomDocument = buildRoomEntity({
    roomNumber : 27,
    capacity : 4,
    occupancyState : true
});

roomDocument.save((err) => {
    if(err) console.log(`An error has occured: ${err}`);
    else console.log(`Document saved: ${roomDocument._id}`);
});

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


