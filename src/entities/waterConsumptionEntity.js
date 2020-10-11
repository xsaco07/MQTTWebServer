const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waterConsumptionSchema = {
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
        consumption : {
            type : Number,
            required : true,
            default : 0.00
        },
        seconds : {
            type : Number,
            required : true, 
            default : 0
        },
        date : {
            type : Date,
            required : true,
            default : new Date()
        }   
    }

}

const WaterConsumption = mongoose.model(
    'WaterConsumption', 
    new Schema(waterConsumptionSchema),
    'waterConsumptions');

module.exports.WaterConsumption = WaterConsumption;
module.exports.buildWaterConsumptionEntity = (waterConsumptionObject) => new WaterConsumption(Object.freeze(waterConsumptionObject));