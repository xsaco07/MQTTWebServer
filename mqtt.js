// Requiring MQTT module
const MQTT = require('mqtt');
const { exit } = require('process');
const mqttClient = MQTT.connect("");

// Defining topics
const rootTopic = "ecoH2o/";
const rootTowelsTopic = `${rootTopic}towels/`;
const rootTotalGeneralLtsTopic = `${rootTopic}Lts/`;
const rootFlowMetersTopic = `${rootTopic}flowMeters/`;

const towelsTopic = `${rootTowelsTopic}#`;
const towelsTotalLtsTopic = `${rootTowelsTopic}Lts/total`;
const towelsTotalKgsTopic = `${rootTowelsTopic}Kgs/total`;
const towelsActualLtsTopic = `${rootTowelsTopic}Lts/actual`;
const towelsActualKgsTopic = `${rootTowelsTopic}Kgs/actual`;
const totalGeneralLtsTopic = `${rootTotalGeneralLtsTopic}total`;
const totalFlowMetersLtsTopic = `${rootFlowMetersTopic}Lts/total`;

TOPICS = {
    "rootTopic" : rootTopic,
    "rootTowelsTopic" : rootTowelsTopic,
    "rootTotalGeneralLtsTopic" : rootTotalGeneralLtsTopic,
    "rootFlowMetersTopic" : rootFlowMetersTopic,
    "towelsTopic" : towelsTopic,
    "towelsTotalLtsTopic" : towelsTotalLtsTopic,
    "towelsTotalKgsTopic" : towelsTotalKgsTopic,
    "towelsActualLtsTopic" : towelsActualLtsTopic,
    "towelsActualKgsTopic" : towelsActualKgsTopic,
    "totalGeneralLtsTopic" : totalGeneralLtsTopic,
    "totalFlowMetersLtsTopic" : totalFlowMetersLtsTopic
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
    mqttClient.subscribe(TOPICS.rootTowelsTopic);
    mqttClient.subscribe(TOPICS.totalFlowMetersLtsTopic);
    mqttClient.subscribe(TOPICS.rootTotalGeneralLtsTopic);
}

module.exports.MQTT = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.TOPICS = TOPICS;