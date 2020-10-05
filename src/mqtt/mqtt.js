// Requiring MQTT module
const MQTT = require('mqtt');
const { exit } = require('process');
const mqttClient = MQTT.connect("");

// Defining topics
const rootTopic = "ecoH2o/";
const rootServerTopic = `${rootTopic}/server/`
const towelsTopic = `${rootServerTopic}towelsInfo/`;
const waterConsumeTopic = `${rootServerTopic}flowInfo/`;

TOPICS = {
    "rootTopic" : rootTopic,
    "rootServerTopic" : rootServerTopic,
    "towelsTopic" : towelsTopic,
    "waterConsumeTopic" : waterConsumeTopic
}

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
    mqttClient.subscribe(TOPICS.rootTopic);
    mqttClient.subscribe(TOPICS.rootServerTopic);
    mqttClient.subscribe(TOPICS.towelsTopic);
    mqttClient.subscribe(TOPICS.waterConsumeTopic);
}

module.exports.MQTT = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.TOPICS = TOPICS;