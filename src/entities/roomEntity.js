const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = {
    roomNumber : {
        type : Number,
        required : true
    },
    capacity : {
        type : Number,
        required : true
    },
    occupancyState : {
        type : Boolean,
        default : false
    }
}

const Room = mongoose.model('Room', new Schema(roomSchema), 'rooms');

module.exports.Room = Room;
module.exports.buildRoomEntity = (roomObject) => new Room(Object.freeze(roomObject));