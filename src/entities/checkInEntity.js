const mongoose = require('mongoose');
const utils = require('../utils/utils');
const Schema = mongoose.Schema;

const checkInSchema = {
    room_id : {
        type : Schema.Types.ObjectId,
        ref : 'Room'
    },
    guest_id : {
        type : Schema.Types.ObjectId,
        ref : 'Guest'
    },
    duration : {
        days : {
            type : Number,
            required : true
        },
        nights : {
            type : Number,
            default : function() {return this.duration.days - 1;}
        }
    },
    date : {
        type : Date,
        default : () => {
            let date = new Date();
            date.setHours(date.getHours() - utils.offsetUTCHours);
            return date;
        }
    },
    status : {
        type : Boolean,
        default : true
    }

}

const CheckIn = mongoose.model('CheckIn', new Schema(checkInSchema), 'checkIns');

module.exports.CheckIn = CheckIn;
module.exports.buildCheckInEntity = (checkInObject) => new CheckIn(Object.freeze(checkInObject));