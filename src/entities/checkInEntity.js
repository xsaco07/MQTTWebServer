const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkInSchema = {
    room_id : {
        type : Schema.Types.ObjectId,
        ref : 'Room'
    },
    duration : {
        days : {
            type : Number,
            required : false,
            default : 0
        },
        nights : {
            type : Number,
            required : false,
            default : 0
        }
    },
    date : {
        type : Date,
        required : true,
        default : new Date()
    }

}

const CheckIn = mongoose.model('CheckIn', new Schema(checkInSchema), 'checkIns');

module.exports.CheckIn = CheckIn;
module.exports.buildCheckInEntity = (checkInObject) => new CheckIn(Object.freeze(checkInObject));