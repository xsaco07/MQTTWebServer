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
    "state" : true
}

const espTotalsTopic = {
    "towels" : {
        "consumption" : 1561,
        "weight" : 1695,
        "towels" : 65
    },
    "water" : {
        "consumption" : 32110,
        "seconds" : 18533,
    },
    "total" : 35000
}