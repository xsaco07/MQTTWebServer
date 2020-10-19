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
            require : true, 
            default : 0
        },
        weight : {
            type : Number,
            required : true,
            default : 0.00
        },
        consumption : {
            type : Number,
            requird : true,
            default : 0.00
        },
        date : {
            type : Date,
            required : true,
            default : () => {
                let date = new Date();
                date.setHours(date.getHours() - utils.offsetUTCHours);
                return date;
            }
        }   
    }

}

const TowelConsumption = mongoose.model(
    'TowelConsumptions', 
    new Schema(towelConsumptionSchema), 
    'towelConsumptions');

module.exports.TowelConsumption = TowelConsumption;
module.exports.buildTowelConsumptionEntity = (towelConsumptionObject) => new TowelConsumption(Object.freeze(towelConsumptionObject));