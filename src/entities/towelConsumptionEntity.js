const mongoose = require('mongoose');
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
            default : new Date()
        }   
    }

}

const TowelConsumption = mongoose.model(
    'TowelConsumptions', 
    new Schema(towelConsumptionSchema), 
    'towelConsumptions');

module.exports.TowelConsumption = TowelConsumption;
module.exports.buildTowelConsumptionEntity = (towelConsumptionObject) => new TowelConsumption(Object.freeze(towelConsumptionObject));