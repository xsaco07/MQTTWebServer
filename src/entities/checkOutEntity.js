const mongoose = require('mongoose');
const utils = require('../utils/utils');
const Schema = mongoose.Schema;

const checkOutSchema = {
    checkIn_id : {
        type : Schema.Types.ObjectId,
        ref : 'CheckIn',
        required : true
    },
    total_id : {
        type : Schema.Types.ObjectId,
        ref : 'Total',
        required : true
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