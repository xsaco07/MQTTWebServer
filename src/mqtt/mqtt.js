// Requiring
const MQTT = require('mqtt');
const espSensorUseCases = require('../use-cases/espSensorUseCases');
const factories = require('../entities/factories');
const errorHandlers = require('../utils/errorHandlers');
const {TOTALS_LIST} = require('../utils/lastTotalsList');
const { Total } = require('../utils/Total');

// MQTT credentials
const USER = 'ecoServer';
const PASSW = 'ecoServerPassword'
const SERVER = 'outstanding-translator.cloudmqtt.com'
const PORT = 1883;
const URL_CONNECTION = `mqtt://${USER}:${PASSW}@${SERVER}:${PORT}`
const mqttClient = MQTT.connect(URL_CONNECTION);

// Suscription topics
const rootTopic = "ecoH2o/";
const rootServerTopic = `${rootTopic}sensor/`
const towelConsumptionTopic = `${rootServerTopic}towelsConsumption/`;
const waterConsumptionTopic = `${rootServerTopic}waterConsumption/`;

// Publish topics
const sensorTotalsTopic = 'totals/';
const sensorStateTopic = 'state/';

const SUB_TOPICS = {
    rootTopic,
    rootServerTopic,
    towelConsumptionTopic,
    waterConsumptionTopic
};

const PUB_TOPICS = {
    sensorTotalsTopic,
    sensorStateTopic
};

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
    mqttClient.subscribe(SUB_TOPICS.rootTopic, errorHandlers.handleSuscriptionError);
    mqttClient.subscribe(SUB_TOPICS.rootServerTopic, errorHandlers.handleSuscriptionError);
    mqttClient.subscribe(SUB_TOPICS.towelConsumptionTopic, errorHandlers.handleSuscriptionError);
    mqttClient.subscribe(SUB_TOPICS.waterConsumptionTopic, errorHandlers.handleSuscriptionError);
}

function listenToMQTTMessages(){
    console.log('Listening to mqtt messages');
    mqttClient.on('message', (topic, message, packet) => {
        switch(topic){
            case SUB_TOPICS.towelConsumptionTopic: 
                handleTowelConsumptionMessage(message, packet);
                break;
            case SUB_TOPICS.waterConsumptionTopic : 
                handleWaterConsumptionMessage(message, packet);
                break;
        }
    });
}

async function handleTowelConsumptionMessage(message, packet) {
    console.log(`Towel message received`);
    let infoPacket = {};
    try {

        infoPacket = JSON.parse(message);

        console.log(infoPacket);

        const sensorName = infoPacket.sensorName;
        const sensorDocument = await espSensorUseCases.getEspSensorByName({sensorName});
        const towelConsumptionObjectData = factories.buildTowelConsumptionEntity({
            sensor_id : sensorDocument._id,
            infoPacket
        });
        const savedObject = await towelConsumptionObjectData.save();

        console.log('Towel consumption object saved');
        console.log(savedObject);

        updateTowelTotals(infoPacket);
        returnTotalsToSensor(infoPacket.sensorName);
    } 
    catch (error) { errorHandlers.handleMQTTMessageInError(error); }
}

async function handleWaterConsumptionMessage(message, packet) {
    console.log(`Water message received`);
    let infoPacket = {};
    try {
        infoPacket = JSON.parse(message);
        const sensorName = infoPacket.sensorName;
        const sensorDocument = await espSensorUseCases.getEspSensorByName({sensorName});
        const towelConsumptionObjectData = factories.buildWaterConsumptionEntity({
            sensor_id : sensorDocument._id,
            infoPacket
        });
        const savedObject = await towelConsumptionObjectData.save();
        console.log('Water consumption object saved');
        console.log(savedObject);
    } 
    catch (error) { errorHandlers.handleMQTTMessageInError(error); }
    finally { 
        updateWaterTotals(infoPacket);
        returnTotalsToSensor(infoPacket.sensorName);
    }
}

function publishStateMessage(sensorName, stateObject){
    const topic = `${rootTopic}server/${sensorName}/${PUB_TOPICS.sensorStateTopic}`;
    const message = JSON.stringify(stateObject);
    console.log(`Publish Topic >> ${topic}`);
    console.log(`Publish Message >> ${message}`);
    mqttClient.publish(topic, message, 
    (err) => errorHandlers.handlePublishMessageError(err, topic, message));
}

function publishTotalsMessage(sensorName, totalsObject){
    const topic = `${rootTopic}server/${sensorName}/${PUB_TOPICS.sensorTotalsTopic}`;
    const message = JSON.stringify(totalsObject);
    console.log(`Topic >> ${topic}`);
    console.log(`Message >> ${message}`);
    mqttClient.publish(topic, message, 
    (err) => errorHandlers.handlePublishMessageError(err, topic, message));
}

function updateTowelTotals(infoPacket){
    // Check if object was already created
    let currentTotalObject = TOTALS_LIST[infoPacket.sensorName];
    if(currentTotalObject == null) {
        currentTotalObject = new Total(infoPacket.sensorName);
        TOTALS_LIST[infoPacket.sensorName] = currentTotalObject;
    }
    console.log(TOTALS_LIST);
    currentTotalObject.increseTowelsTotals(
        infoPacket.consumption,
        infoPacket.towels,
        infoPacket.weight
    );
}

function updateWaterTotals(infoPacket){
    // Check if object was already created
    let currentTotalObject = TOTALS_LIST[infoPacket.sensorName];
    if(currentTotalObject == null) {
        currentTotalObject = new Total(infoPacket.sensorName);
        TOTALS_LIST[infoPacket.sensorName] = currentTotalObject;
    }
    currentTotalObject.increaseWaterTotals(
        infoPacket.consumption,
        infoPacket.seconds
    );
}

function returnTotalsToSensor(sensorName){
    const totalsObject = TOTALS_LIST[sensorName].LAST_TOTALS;
    publishTotalsMessage(sensorName, totalsObject);
}

module.exports.mqttClient = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.listenToMQTTMessages = listenToMQTTMessages;
module.exports.publishStateMessage = publishStateMessage;
module.exports.publishTotalsMessage = publishTotalsMessage;
module.exports.SUB_TOPICS = SUB_TOPICS;
module.exports.PUB_TOPICS = PUB_TOPICS;
