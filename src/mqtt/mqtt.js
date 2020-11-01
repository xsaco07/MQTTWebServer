// Requiring
const MQTT = require('mqtt');
const entities = require('../entities/entities')
const espSensorUseCases = require('../use-cases/espSensorUseCases');
const guestUseCases = require('../use-cases/guestUseCases');
const totalUseCases = require('../use-cases/totalUseCases');
const towelConsumptionUseCases = require('../use-cases/towelConsumptionUseCases');
const waterConsumptionUseCases = require('../use-cases/waterConsumptionUseCases');
const errorHandlers = require('../utils/errorHandlers');
const sockets = require('../socketEvents/sockets');

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
    mqttClient.on('message', (topic, message) => {
        switch(topic){
            case SUB_TOPICS.towelConsumptionTopic: 
                handleTowelConsumptionMessage(message);
                break;
            case SUB_TOPICS.waterConsumptionTopic : 
                handleWaterConsumptionMessage(message);
                break;
        }
    });
}

async function handleTowelConsumptionMessage(message) {
    console.log(`Towel message received`);
    let parsedMessage = {};
    try {
        parsedMessage = JSON.parse(message);
        const savedObject = await towelConsumptionUseCases.newTowelConsumption(parsedMessage);
        const guestDoc = await getGuestByConsumption(savedObject);
        updateTowelTotals(parsedMessage);
        updateTowelsXAgeChart(savedObject, guestDoc);
        updateTowelsXCountryChart(savedObject, guestDoc);
        updateTowelsXDayChart(savedObject);
    } 
    catch (error) { errorHandlers.handleMQTTMessageInError(error); }
}

async function handleWaterConsumptionMessage(message) {
    console.log(`Water message received`);
    let parsedMessage = {};
    try {
        parsedMessage = JSON.parse(message);
        const savedObject = await waterConsumptionUseCases.newWaterConsumption(parsedMessage);
        updateWaterTotals(parsedMessage);
        const guestDoc = await getGuestByConsumption(savedObject);
        updateWaterXAgeChart(savedObject, guestDoc);
        updateWaterXCountryChart(savedObject, guestDoc);
    } 
    catch (error) { errorHandlers.handleMQTTMessageInError(error); }
}

function publishStateMessage(sensorName, stateObject){
    const topic = `${rootTopic}server/${sensorName}/${PUB_TOPICS.sensorStateTopic}`;
    const message = JSON.stringify(stateObject);
    mqttClient.publish(topic, message, 
    (err) => errorHandlers.handlePublishMessageError(err, topic, message));
}

function publishTotalsMessage(sensorName, totalsObject){
    const topic = `${rootTopic}server/${sensorName}/${PUB_TOPICS.sensorTotalsTopic}`;
    const message = JSON.stringify(totalsObject);
    mqttClient.publish(topic, message, 
    (err) => errorHandlers.handlePublishMessageError(err, topic, message));
}

// Get total object by sensor name
// Update towel values
// Save again
// Publish-back totals object via mqtt
async function updateTowelTotals(infoPacket){
    const sensorDocument = await espSensorUseCases.getEspSensorByName(
        {sensorName : infoPacket.sensorName}
    );
    // TODO: change for getTotalBySensorIdAndCheckInId
    let totalDocument = (await totalUseCases.getTotalBySensorId({sensor_id : sensorDocument._id}))[0];
    totalDocument.totals.towels.consumption += infoPacket.consumption;
    totalDocument.totals.towels.weight += infoPacket.weight;
    totalDocument.totals.towels.towels += infoPacket.towels;
    totalDocument.totals.totalConsumption += infoPacket.consumption;
    const updatedDocument = await totalDocument.save();
    publishTotalsMessage(sensorDocument.sensorName, updatedDocument.totals);
}

// Get total object by sensor name
// Update water values
// Save again
// Publish-back totals object via mqtt
async function updateWaterTotals(infoPacket){
    const sensorDocument = await espSensorUseCases.getEspSensorByName(
        {sensorName : infoPacket.sensorName}
    );
    let totalDocument = (await totalUseCases.getTotalBySensorId({sensor_id : sensorDocument._id}))[0];
    totalDocument.totals.water.consumption += infoPacket.consumption;
    totalDocument.totals.water.seconds += infoPacket.seconds;
    totalDocument.totals.totalConsumption += infoPacket.consumption;
    const updatedDocument = await totalDocument.save();
    publishTotalsMessage(sensorDocument.sensorName, updatedDocument.totals);
}

const getGuestByConsumption = async (consumptionDoc) => {
    let sensorDoc = {};
    let checkInDoc = {};
    let guestDoc = {};
    try { 
        sensorDoc = await espSensorUseCases.getEspSensorById({sensor_id : consumptionDoc.sensor_id});
        checkInDoc = await entities.CheckIn.findOne({room_id : sensorDoc.room_id, status : true});
        guestDoc = await guestUseCases.getGuestById({guest_id : checkInDoc.guest_id});
        return guestDoc;
    } 
    catch (error) { 
        console.log(`Error: ${err}`);
        throw new Error(err);
    }
};

const updateTowelsXAgeChart = async (towelConsumptionDoc, guestDoc) => {
    console.log("Call socket to emit message");
    sockets.emitTowelsXAge(
        guestDoc.age, 
        towelConsumptionDoc.infoPacket.towels,
        towelConsumptionDoc.infoPacket.consumption);
};

const updateTowelsXCountryChart = async (towelConsumptionDoc, guestDoc) => {
    console.log("Call socket to emit message");
    sockets.emitTowelsXCountry(
        guestDoc.country, 
        towelConsumptionDoc.infoPacket.towels,
        towelConsumptionDoc.infoPacket.consumption);
};

const updateTowelsXDayChart = (towelConsumptionDoc) => {
    const date = towelConsumptionDoc.infoPacket.datetoISOString().slice(0,10);
    sockets.emitTowelsXDay(
        towelConsumptionDoc.infoPacket.towels,
        date
    );
};

const updateWaterXAgeChart = async (waterConsumptionDoc, guestDoc) => {
    console.log("Call socket to emit message");
    console.log(waterConsumptionDoc);
    sockets.emitWaterXAge(
        guestDoc.age,
        waterConsumptionDoc.infoPacket.consumption);
};

const updateWaterXCountryChart = async (waterConsumptionDoc, guestDoc) => {
    console.log("Call socket to emit message");
    sockets.emitWaterXCountry(
        guestDoc.country,
        waterConsumptionDoc.infoPacket.consumption);
};

module.exports.mqttClient = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.listenToMQTTMessages = listenToMQTTMessages;
module.exports.publishStateMessage = publishStateMessage;
module.exports.publishTotalsMessage = publishTotalsMessage;
module.exports.SUB_TOPICS = SUB_TOPICS;
module.exports.PUB_TOPICS = PUB_TOPICS;
