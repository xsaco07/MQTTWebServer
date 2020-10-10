// MQTT Subscibe Messages Examples
const serverTowelsTopic = {
    "sensorName" : "ESPCN01",
    "toallas" : 4,
    "pesoGR" : 1300,
    "consumoML" : 500,
    "fecha" : "2020-10-12"
}

const serverWaterConsumeTopic = {
    "sensorName" : "ESPCN03",
    "consumoML" : 500,
    "seconds" : 128,
    "fecha" : "2020-10-12"
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