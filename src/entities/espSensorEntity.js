const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const espSensorSchema = {
    sensorName : {
        type : String,
        required : true,
        default : 'Nameless_sensor'
    },
    state : {
        type : Boolean,
        required : true,
        default : false
    },
    room_id : {
        type : Schema.Types.ObjectId,
        required : true, 
        ref : 'Room'
    }

}

const EspSensor = mongoose.model('EspSensor', new Schema(espSensorSchema), 'espSensors');

module.exports.EspSensor = EspSensor;
module.exports.buildEspSensorEntity = (espSensorObject) => new EspSensor(Object.freeze(espSensorObject));