const mongoose = require('mongoose');
const utils = require('../utils/utils');
const Schema = mongoose.Schema;

const checkOutSchema = {
    checIn_id : {
        type : Schema.Types.ObjectId,
        ref : 'CheckIn',
        required : true
    },
    totalWaterConsumption : {
        consumption : {
            type : Number,
            required : true,
            default : 0
        },
        seconds : {
            type : Number,
            required : true,
            default : 0
        }
    },
    totalTowelsConsumption : {
        towels : {
            type : Number,
            required : true
        },
        weight : {
            type : Number,
            required : true
        },
        consumption : {
            type : Number,
            required : true
        }
    },
    totalConsumption : {
        type : Number,
        default : () => this.totalTowelsConsumption.consumption + this.totalWaterConsumption.consumption
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