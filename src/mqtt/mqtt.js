// Requiring
const MQTT = require('mqtt');
const useCases = require('../use-cases/useCases');
const factories = require('../entities/factories');
const errorHandlers = require('../utils/errorHandlers');

// MQTT credentials
const USER = 'ecoServer';
const PASSW = 'ecoServerPassword'
const SERVER = 'outstanding-translator.cloudmqtt.com'
const PORT = 1883;
const URL_CONNECTION = `mqtt://${USER}:${PASSW}@${SERVER}:${PORT}`
const mqttClient = MQTT.connect(URL_CONNECTION);

// Defining topics
const rootTopic = "ecoH2o/";
const rootServerTopic = `${rootTopic}sensor/`
const towelConsumptionTopic = `${rootServerTopic}towelsConsumption/`;
const waterConsumptionTopic = `${rootServerTopic}waterConsumption/`;

TOPICS = {
    rootTopic,
    rootServerTopic,
    towelConsumptionTopic,
    waterConsumptionTopic
}

// Connect mqtt client and subscribe it to the topics
function connectClient(){
    mqttClient.on("connect", () => {
        console.log("Connected to MQTT server");
        subscribeToTopics();
    });
    mqttClient.on("error", (error) => {
        console.log("Error received: " + error);
        exit(1);
    });
}

function subscribeToTopics(){
    mqttClient.subscribe(TOPICS.rootTopic, errorHandlers.suscriptionErrorHandler);
    mqttClient.subscribe(TOPICS.rootServerTopic, errorHandlers.suscriptionErrorHandler);
    mqttClient.subscribe(TOPICS.towelConsumptionTopic, errorHandlers.suscriptionErrorHandler);
    mqttClient.subscribe(TOPICS.waterConsumptionTopic, errorHandlers.suscriptionErrorHandler);
}

function listenToMQTTMessages(){
    console.log('Listening to mqtt messages');
    mqttClient.on('message', (topic, message, packet) => {
        switch(topic){
            case TOPICS.towelConsumptionTopic: 
                handleTowelConsumptionMessage(message, packet);
                break;
            case TOPICS.waterConsumptionTopic : 
                handleWaterConsumptionMessage(message, packet);
                break;
        }
    });
}

async function handleTowelConsumptionMessage(message, packet) {
    console.log(`Towel message received`);
    try {
        const infoPacket = JSON.parse(message);
        console.log(infoPacket);
        const sensorName = infoPacket.sensorName;
        const sensorDocument = await useCases.espSensorUseCases.getEspSensorByName({sensorName});
        const towelConsumptionObjectData = factories.buildTowelConsumptionEntity({
            sensor_id : sensorDocument._id,
            infoPacket
        });
        const savedObject = await towelConsumptionObjectData.save();
        console.log('Towel consumption object saved');
        console.log(savedObject);
    } catch (error) {
        errorHandlers.handleMQTTMessageInError(error);
    }

}

async function handleWaterConsumptionMessage(message, packet) {
    console.log(`Water message received`);
    try {
        const infoPacket = JSON.parse(message);
        console.log(infoPacket);
        const sensorName = infoPacket.sensorName;
        const sensorDocument = await useCases.espSensorUseCases.getEspSensorByName({sensorName});
        const towelConsumptionObjectData = factories.buildWaterConsumptionEntity({
            sensor_id : sensorDocument._id,
            infoPacket
        });
        const savedObject = await towelConsumptionObjectData.save();
        console.log('Water consumption object saved');
        console.log(savedObject);
    } catch (error) {
        errorHandlers.handleMQTTMessageInError(error);
    }
}

module.exports.mqttClient = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.listenToMQTTMessages = listenToMQTTMessages;
module.exports.TOPICS = TOPICS;