const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = {
    roomNumber : {
        type : Number,
        required : true,
        default : 0,
    },
    capacity : {
        type : Number,
        required : true,
        default : 0
    },
    occupancyState : {
        type : Boolean,
        required : true,
        default : false
    }
}

const Room = mongoose.model('Room', new Schema(roomSchema), 'rooms');

module.exports.Room = Room;
module.exports.buildRoomEntity = (roomObject) => new Room(Object.freeze(roomObject));