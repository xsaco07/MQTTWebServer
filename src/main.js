// Requirements
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const mqttClient = require('./mqtt/mqtt');

// Express settings
const app = express();
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Static Files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, '../views')));

// Start listening
const server = app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
});

// Init websockets
const io = socketIo(server);
io.on('connection', (socket) => {
    console.log("New connection");
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

function towelsMessageReceived(towelsMessage){
    const obj = JSON.parse(towelsMessage);
    console.log(`Message parsed: ${obj}`);
    // post to API
}

function flowMeterMessageReceived(flowMeterMessage){
    const obj = JSON.parse(flowMeterMessage);
    console.log(`Message parsed: ${obj}`);
    // post to API
}

function startListeningMqtt(){
    mqttClient.on("message", (topic, message, packet) => {
        switch(topic){
            case mqttClient.TOPICS.towelsTopic:
                towelsMessageReceived(message);
                break;
            case mqttClient.TOPICS.waterConsumeTopic:
                flowMeterMessageReceived(message);
                break;
            default: break;
        }
    });
}

function setUpMqtt(){
    mqttClient.connectClient();
    mqttClient.subscribeToTopics();
    startListeningMqtt();
}
