const mongoose = require('mongoose');
const utils = require('../utils/utils');
const Schema = mongoose.Schema;

const towelConsumptionSchema = {
    sensor_id : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'EspSensor'
    },
    infoPacket : {
        sensorName : {
            type : String,
            required : true,
        },
        towels : {
            type : Number,
            default : 0, // this value is calculated at a server level
        },
        weight : {
            type : Number,
            required : true,
        },
        consumption : {
            type : Number,
            requird : true,
        },
        date : {
            type : Date,
            default : () => {
                let date = new Date();
                date.setHours(date.getHours() - utils.offsetUTCHours);
                return date;
            }
        }   
    },
    expected : {
        type : Boolean,
        default : true,
    }
}

const schema = new Schema(towelConsumptionSchema);

const TowelConsumption = mongoose.model('TowelConsumptions', schema, 'towelConsumptions');

module.exports.TowelConsumption = TowelConsumption;
module.exports.buildTowelConsumptionEntity = (towelConsumptionObject) => new TowelConsumption(Object.freeze(towelConsumptionObject));