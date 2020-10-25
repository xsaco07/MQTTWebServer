// Requiring
const MQTT = require('mqtt');
const useCases = require('../use-cases/useCases');
const factories = require('../entities/factories');
const errorHandlers = require('../utils/errorHandlers');
const {LastTotals} = require('../utils/lastTotals');

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
    let sensorName = '';
    try {
        infoPacket = JSON.parse(message);
        sensorName = infoPacket.sensorName;
        const sensorDocument = await useCases.espSensorUseCases.getEspSensorByName({sensorName});
        const towelConsumptionObjectData = factories.buildTowelConsumptionEntity({
            sensor_id : sensorDocument._id,
            infoPacket
        });
        const savedObject = await towelConsumptionObjectData.save();
        console.log('Towel consumption object saved');
        console.log(savedObject);
    } 
    catch (error) { errorHandlers.handleMQTTMessageInError(error); }
    finally {
        updateTowelTotals(infoPacket);
        returnTotalsToSensor(sensorName);
    }
}

function returnTotalsToSensor(sensorName){
    const totalsObject = LastTotals.LAST_TOTALS;
    publishTotalsMessage(sensorName, totalsObject);
}

async function handleWaterConsumptionMessage(message, packet) {
    console.log(`Water message received`);
    let infoPacket = {};
    let sensorName = '';
    try {
        infoPacket = JSON.parse(message);
        sensorName = infoPacket.sensorName;
        const sensorDocument = await useCases.espSensorUseCases.getEspSensorByName({sensorName});
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
        returnTotalsToSensor(sensorName);
    }
}

function publishStateMessage(sensorName, stateObject){
    const topic = `${rootTopic}/server/${sensorName}/${PUB_TOPICS.sensorStateTopic}`;
    const message = JSON.stringify(stateObject);
    mqttClient.publish(topic, message, 
    (err) => errorHandlers.handlePublishMessageError(err, topic, message));
}

function publishTotalsMessage(sensorName, totalsObject){
    const topic = `${rootTopic}/server/${sensorName}/${PUB_TOPICS.sensorTotalsTopic}`;
    const message = JSON.stringify(totalsObject);
    mqttClient.publish(topic, message, 
    (err) => errorHandlers.handlePublishMessageError(err, topic, message));
}

function updateTowelTotals(infoPacket){
    LastTotals.increseTowelsTotals(
        infoPacket.consumption,
        infoPacket.towels,
        infoPacket.weight
    );
}

function updateWaterTotals(infoPacket){
    LastTotals.increaseWaterTotals(
        infoPacket.consumption,
        infoPacket.seconds
    );
}

module.exports.mqttClient = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.listenToMQTTMessages = listenToMQTTMessages;
module.exports.publishStateMessage = publishStateMessage;
module.exports.publishTotalsMessage = publishTotalsMessage;
module.exports.SUB_TOPICS = SUB_TOPICS;
module.exports.PUB_TOPICS = PUB_TOPICS;
