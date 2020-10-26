const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const totalSchema = {
    checkIn_id : {
        type : Schema.Types.ObjectId,
        required: true,
        ref : 'CheckIn'
    },
    sensor_id : {
        type : Schema.Types.ObjectId,
        required: true,
        ref : 'EspSensor'
    },
    totals : {
        towels : {
            consumption : {
                type : Number,
                required : true,
                default : 0.00
            },
            towels : {
                type : Number,
                required : true,
                default : 0
            },
            weight : {
                type : Number,
                required : true,
                default : 0.00
            }
        },
        water : {
            consumption : {
                type : Number,
                required : true,
                default : 0.00
            },
            seconds : {
                type : Number,
                required : true,
                default : 0.00
            }
        }
    }
}

const Total = mongoose.model('Total', new Schema(totalSchema), 'totals');

module.exports.Total = Total;
module.exports.buildTotalEntity = (totalObject) => new Total(Object.freeze(totalObject));