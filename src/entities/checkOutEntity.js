const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkOutSchema = {
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
            required : false,
            default : 0
        },
        nights : {
            type : Number,
            required : false,
            default : 0
        }
    },
    totalWaterConsume : {
        type : Number,
        required : true,
        default : 0
    },
    totalTowelsConsume : {
        type : Number,
        required : true,
        default : 0
    },
    date : {
        type : Date,
        required : true,
        default : Date.now()
    }

}

const CheckOut = mongoose.model('CheckOut', new Schema(checkOutSchema), 'checkOuts');

module.exports.CheckOut = CheckOut;
module.exports.buildCheckOutEntity = (checkOutObject) => new CheckOut(Object.freeze(checkOutObject));