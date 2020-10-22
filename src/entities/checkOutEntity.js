const mongoose = require('mongoose');
const utils = require('../utils/utils');
const Schema = mongoose.Schema;

const checkOutSchema = {
    checkIn_id : {
        type : Schema.Types.ObjectId,
        ref : 'CheckIn',
        required : true
    },
    totalWaterConsumption : {
        consumption : {
            type : Number,
            default : 0
        },
        seconds : {
            type : Number,
            default : 0
        }
    },
    totalTowelsConsumption : {
        towels : {
            type : Number,
            default : 0
        },
        weight : {
            type : Number,
            default : 0
        },
        consumption : {
            type : Number,
            default : 0
        }
    },
    totalConsumption : {
        type : Number,
        default : function() {
            return this.totalTowelsConsumption.consumption + this.totalWaterConsumption.consumption
        }
    },
    date : {
        type : Date,
        default : () => {
            let date = new Date();
            date.setHours(date.getHours() - utils.offsetUTCHours);
            return date;
        }
    }

}

const CheckOut = mongoose.model('CheckOut', new Schema(checkOutSchema), 'checkOuts');

module.exports.CheckOut = CheckOut;
module.exports.buildCheckOutEntity = (checkOutObject) => new CheckOut(Object.freeze(checkOutObject));