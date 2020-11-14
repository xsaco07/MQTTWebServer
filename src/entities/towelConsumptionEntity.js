const mongoose = require('mongoose');
const utils = require('../utils/utils');
const constants = require('../utils/constants');
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
            default : function() {
                const count = Math.round(this.infoPacket.weight / constants.TOWEL_WEIGHT_GR_APROX);
                return (count === 0) ? 1 : count;
            }, 
        },
        weight : {
            type : Number,
            required : true,
        },
        consumption : {
            type : Number,
            default : function() {
                const consumption = this.infoPacket.towels * constants.WATER_CONSUMP_APROX;
                return consumption;
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