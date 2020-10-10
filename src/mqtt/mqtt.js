// Requiring MQTT module
const MQTT = require('mqtt');
const { exit } = require('process');
const saveTowelConsumption = require('../controllers/mqttControllers/towelsConsumeController');
const saveTowelConsumption = require('../controllers/mqttControllers/waterConsumeController');
const mqttClient = MQTT.connect("");

// Defining topics
const rootTopic = "ecoH2o/";
const rootServerTopic = `${rootTopic}/server/`
const towelsTopic = `${rootServerTopic}towelsConsumption/`;
const waterConsumeTopic = `${rootServerTopic}waterConsumption/`;

TOPICS = {
    "rootTopic" : rootTopic,
    "rootServerTopic" : rootServerTopic,
    "towelsTopic" : towelsTopic,
    "waterConsumeTopic" : waterConsumeTopic
}

const errorHandler = (error) => console.log(`An error has occured: ${error}`);

// Connect mqtt client and subscribe it to the topics
function connectClient(){
    mqttClient.on("connect", () => {
        console.log("Connected to MQTT server");
    });
    mqttClient.on("error", (error) => {
        console.log("Error received: " + error);
        exit(1);
    });
}

function subscribeToTopics(){
    mqttClient.subscribe(TOPICS.rootTopic, errorHandler);
    mqttClient.subscribe(TOPICS.rootServerTopic, errorHandler);
    mqttClient.subscribe(TOPICS.towelsTopic, errorHandler);
    mqttClient.subscribe(TOPICS.waterConsumeTopic, errorHandler);
}

function startListeningMqtt(){
    mqttClient.on("message", (topic, message, packet) => {
        switch(topic){
            case mqttClient.TOPICS.towelsTopic:
                saveTowelConsumption(message);
                break;
            case mqttClient.TOPICS.waterConsumeTopic:
                flowMeterMessageReceived(message);
                break;
            default: break;
        }
    });
}

module.exports.mqttClient = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.startListeningMqtt = startListeningMqtt;
module.exports.TOPICS = TOPICS;