// MQTT Message Examples

const serverTowelsTopic = {
    "sensorId" : "ESPCN01",
    "toallas" : 4,
    "pesoGR" : 1300,
    "consumoML" : 500,
    "fecha" : "2020-10-12"
}

const serverWaterConsumeTopic = {
    "sensorId" : "ESPCN03",
    "consumoML" : 500,
    "fecha" : "2020-10-12"
}

const espStateTopic = {
    "sensorId" : "ESPCN03",
    "state" : true
}

const espTotalsTopic = {
    "sensorId" : "ESPCN06",
    "totalTowelsWaterConsume" : 1561,
    "totalFlowMetersWaterConsume" : 32110,
    "totalWaterConsume" : 32.11,
    "totalWeight" : 1695,
    "totalTowels" : 6
}

/** Mongo Collections
 * 
 */
const sensorESP = [
    {
        "_id" : "espCanasto01",
        "estado" : true,
        "habitacion" : 2 
    },
    {
        "_id" : "espFlujometro01",
        "estado" : true,
        "habitacion" : 2 
    }
]

const toallasInfo = 
{
    "_id" : 1,
    "infoPacket" : {
        "espCanastoId" : "espFlujometro05",
        "toallasActual" : 25,
        "litros/toallaActual" : 65,
        "peso" : 1500,
        "fecha" : "2020-10-10"
    },
    "habitacion" : 5,
}

const flujoInfo = 
{
    "_id" : 1,
    "infoPacket" : {
        "espFlujometroId" : "espFlujometro01",
        "litrosActual" : 25,
    },
    "habitacion" : 5,
    "fecha" : "2020-10-10"
}

const checkOut = 
{
    "_id" : 1,
    "habitacion" : 2,
    "fecha" : "2020-15-10",
    "consumoLitros" : 183,
    "consumoToallas" : 9
}

const checkIn = 
{
    "_id" : 1,
    "habitacion" : 2,
    "fecha" : "2020-15-10",
    "huesped" : "Isaac Mena Lopez",
    "duracion" : {
        "dias" : 2,
        "noches" : 3
    }
}

const habitacion = 
{
    "_id" : 11,
    "capacidad" : 4,
    "numero" : 12,
    "estado" : true
}