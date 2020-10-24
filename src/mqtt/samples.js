// MQTT Subscibe Messages Examples
const serverTowelsTopic = {
    "sensorName" : "ESPSensor-01",
    "towels" : 4,
    "weight" : 1300,
    "consumption" : 500,
    "date" : "2020-10-12"
}

const serverWaterConsumeTopic = {
    "sensorName" : "ESPSensor-01",
    "consumption" : 500,
    "seconds" : 128,
    "date" : "2020-10-12"
}

// MQTT Publish Messages Examples
const espStateTopic = {
    "sensorName" : "ESPCN03",
    "state" : true
}

const espTotalsTopic = {
    "sensorName" : "ESPCN06",
    "totalTowelsWaterConsume" : 1561,
    "totalFlowMetersWaterConsume" : 32110,
    "totalWaterConsume" : 32.11,
    "totalWaterConsumeTime" : 18533,
    "totalWeight" : 1695,
    "totalTowels" : 65
}