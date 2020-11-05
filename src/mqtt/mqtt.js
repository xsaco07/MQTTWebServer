// Requiring
const MQTT = require('mqtt');
const entities = require('../entities/entities')
const utils = require('../utils/utils');
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
        if(savedObject.expected) {
            const guestDoc = await getGuestByConsumption(savedObject);
            updateTowelTotals(parsedMessage);
            updateTowelsXAgeChart(savedObject, guestDoc);
            updateTowelsXCountryChart(savedObject, guestDoc);
            updateTowelsXDayChart(savedObject);
            updateTowelsXHourChart(savedObject);
            updateTowelsXRoomChart(savedObject);
            updateTotalTowelsMetric();
        }
        else {
            console.log('ALERT! Not expected towel consumption');  
            console.log('Send notification');   
        }
    } 
    catch (error) { errorHandlers.handleMQTTMessageInError(error); }
}

async function handleWaterConsumptionMessage(message) {
    console.log(`Water message received`);
    let parsedMessage = {};
    try {
        parsedMessage = JSON.parse(message);
        const savedObject = await waterConsumptionUseCases.newWaterConsumption(parsedMessage);
        if(savedObject.expected) {
            const guestDoc = await getGuestByConsumption(savedObject);
            updateWaterTotals(parsedMessage);
            updateWaterXAgeChart(savedObject, guestDoc);
            updateWaterXCountryChart(savedObject, guestDoc);
            updateWaterXDayChart(savedObject);
            updateWaterXHourChart(savedObject);
            updateWaterXRoomChart(savedObject);
            updateTotalWaterMetric();
        }
        else {
            console.log('ALERT! Not expected water consumption');
            console.log('Sendo notification');
        }
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

// Based on a towelConsumptionDocument returns the guest who consume
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
    console.log("Updating towelsXAge chart");
    sockets.emitTowelsXAge(
        guestDoc.age, 
        towelConsumptionDoc.infoPacket.towels,
        towelConsumptionDoc.infoPacket.consumption);
};

const updateTowelsXCountryChart = async (towelConsumptionDoc, guestDoc) => {
    console.log("Updating towelsXCountry chart");
    sockets.emitTowelsXCountry(
        guestDoc.country, 
        towelConsumptionDoc.infoPacket.towels,
        towelConsumptionDoc.infoPacket.consumption);
};

const updateTowelsXDayChart = (towelConsumptionDoc) => {
    console.log("Updating towelsXDay chart");
    const date = towelConsumptionDoc.infoPacket.date.toISOString().slice(0,10);
    sockets.emitTowelsXDay(
        towelConsumptionDoc.infoPacket.towels,
        towelConsumptionDoc.infoPacket.consumption,
        date
    );
};

const updateTowelsXHourChart = (towelConsumptionDoc) => {
    console.log("Updating towelsXHour chart");
    const date = towelConsumptionDoc.infoPacket.date;
    // Fix hours offset
    date.setHours(date.getHours() + utils.offsetUTCHours);
    let hour = date.getHours();
    // Add leading 0 for the hours smaller than 10
    if(hour < 10) hour = `0${hour}`;
    sockets.emitTowelsXHour(
        towelConsumptionDoc.infoPacket.towels,
        towelConsumptionDoc.infoPacket.consumption,
        hour
    );
};

const updateTowelsXRoomChart = async (towelConsumptionDoc) => {
    console.log("Updating towelsXRoom chart");
    const sensorDoc = await entities.EspSensor.findById(towelConsumptionDoc.sensor_id, 'room_id');
    const roomDoc = await entities.Room.findById(sensorDoc.room_id, 'roomNumber occupancyState');
    sockets.emitTowelsXRoom(
        towelConsumptionDoc.infoPacket.towels,
        towelConsumptionDoc.infoPacket.consumption,
        roomDoc.roomNumber,
        roomDoc.occupancyState
    );
};

const updateTotalTowelsMetric = async () => {
    console.log("Updating total towels metric");
    const totals = towelConsumptionUseCases.metrics.totalConsumption();
    sockets.emitTotalTowelsMetric(
        totals.towels,
        totals.weight,
        totals.consumption
    );
};

const updateWaterXAgeChart = async (waterConsumptionDoc, guestDoc) => {
    console.log("Updating waterXAge chart");
    console.log("Call socket to emit message");
    console.log(waterConsumptionDoc);
    sockets.emitWaterXAge(
        guestDoc.age,
        waterConsumptionDoc.infoPacket.consumption);
};

const updateWaterXCountryChart = async (waterConsumptionDoc, guestDoc) => {
    console.log("Updating waterXCountry chart");
    sockets.emitWaterXCountry(
        guestDoc.country,
        waterConsumptionDoc.infoPacket.consumption);
};

const updateWaterXDayChart = (waterConsumptionDoc) => {
    console.log("Updating waterXDay chart");
    const date = waterConsumptionDoc.infoPacket.date.toISOString().slice(0,10);
    sockets.emitWaterXDay(
        waterConsumptionDoc.infoPacket.consumption,
        waterConsumptionDoc.infoPacket.seconds,
        date
    );
};

const updateWaterXHourChart = (waterConsumptionDoc) => {
    console.log("Updating waterXHour chart");
    const date = waterConsumptionDoc.infoPacket.date;
    // Fix hours offset
    date.setHours(date.getHours() + utils.offsetUTCHours);
    let hour = date.getHours();
    // Add leading 0 for the hours smaller than 10
    if(hour < 10) hour = `0${hour}`;
    sockets.emitWaterXHour(
        waterConsumptionDoc.infoPacket.consumption,
        waterConsumptionDoc.infoPacket.seconds,
        hour
    );
};

const updateWaterXRoomChart = async (waterConsumptionDoc) => {
    console.log("Updating waterXRoom chart");
    const sensorDoc = await entities.EspSensor.findById(waterConsumptionDoc.sensor_id, 'room_id');
    const roomDoc = await entities.Room.findById(sensorDoc.room_id, 'roomNumber occupancyState');
    sockets.emitWaterXRoom(
        waterConsumptionDoc.infoPacket.consumption,
        waterConsumptionDoc.infoPacket.seconds,
        roomDoc.roomNumber,
        roomDoc.occupancyState
    )
};

const updateTotalWaterMetric = async () => {
    console.log("Updating total water metric");
    const totals = waterConsumptionUseCases.metrics.totalConsumption();
    sockets.emitTotalWaterMetric(
        totals.consumption,
        totals.seconds
    );
};

module.exports.mqttClient = mqttClient;
module.exports.connectClient = connectClient;
module.exports.subscribeToTopics = subscribeToTopics;
module.exports.listenToMQTTMessages = listenToMQTTMessages;
module.exports.publishStateMessage = publishStateMessage;
module.exports.publishTotalsMessage = publishTotalsMessage;
module.exports.SUB_TOPICS = SUB_TOPICS;
module.exports.PUB_TOPICS = PUB_TOPICS;
