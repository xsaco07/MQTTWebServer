// Requirements
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socket = require('./socketEvents/sockets');

// For ENV variables
require('dotenv').config();

// Routes
const roomRoutes = require('./routes/roomRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const checkInRoutes = require('./routes/checkInRoutes');
const checkOutRoutes = require('./routes/checkOutRoutes');
const guestRoutes = require('./routes/guestRoutes');
const totalRoutes = require('./routes/totalRoutes');
const towelConsumptionRoutes = require('./routes/towelConsumptionRoutes');
const waterConsumptionRoutes = require('./routes/waterConsumptionRoutes');
const userRoutes = require('./routes/userRoutes');

// Use cases
const useCases = require('./use-cases/useCases');

// DB
const {makeDB} = require('./data-access/mongodb');

// MQTT
const mqtt = require('./mqtt/mqtt');

// Express settings
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// Routes set up
app.use('/api/room', roomRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/guest', guestRoutes);
app.use('/api/checkIn', checkInRoutes);
app.use('/api/checkOut', checkOutRoutes);
app.use('/api/total', totalRoutes);
app.use('/api/towelConsumption', towelConsumptionRoutes);
app.use('/api/waterConsumption', waterConsumptionRoutes);
app.use('/api/user', userRoutes);

// Static Files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, '../views')));

// Mongo connection
makeDB();

// Start listening
const server = app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
    mqtt.connectClient();
    mqtt.listenToMQTTMessages();
});

// Init web sockets
socket.connect(server);

// Render tables
app.get('/', async (req, res, next) => {
    const towelsMetric = (await useCases.towelConsumptionUseCases.metrics.totalConsumption())[0];
    const waterMetric = (await useCases.waterConsumptionUseCases.metrics.totalConsumption())[0];
    const activeCheckIns = await useCases.checkInUseCases.metrics.activeCheckIns();
    res.render('index', {towelsMetric, waterMetric, activeCheckIns});
});

app.get('/guests/', async (req, res, next) => {
    const guests = await useCases.guestUseCases.getGuests();
    res.render('navigation/ejs/guests', {guests});
});

app.get('/rooms/', async (req, res, next) => {
    const rooms = await useCases.roomUseCases.getRooms();
    res.render('navigation/ejs/rooms', {rooms});
});

app.get('/checkIns/', async (req, res, next) => {
    const checkIns = await useCases.checkInUseCases.getCheckIns();
    res.render('navigation/ejs/checkIns', {checkIns});
});

app.get('/sensors/', async (req, res, next) => {
    const sensors = await useCases.espSensorUseCases.getEspSensors();
    res.render('navigation/ejs/sensors', {sensors});
});

app.get('/totals/', async (req, res, next) => {
    const totals = await useCases.totalUseCases.getTotals();
    res.render('navigation/ejs/totals', {totals});
});

app.get('/checkOuts/', async (req, res, next) => {
    const checkOuts = await useCases.checkOutUseCases.getCheckOuts();
    res.render('navigation/ejs/checkOuts', {checkOuts});
});

app.get('/unexpected/', async (req, res, next) => {
    const waterConsumptions = await useCases.waterConsumptionUseCases.getWaterConsumptionsByExpectedState({
        expected : false
    });
    const towelConsumptions = await useCases.towelConsumptionUseCases.getTowelConsumptionsByExpectedState({
        expected : false
    });
    res.render('navigation/ejs/unexpected', {waterConsumptions, towelConsumptions});
});

// Render forms
app.get('/newCheckIn/', async (req, res, next) => {
    // Send available rooms to the form
    const rooms = await useCases.roomUseCases.getRoomsByOccupancyState({
        occupancyState : false
    });
    res.render('forms/newCheckIn', {rooms});
});

/* const madge = require('madge');
 
madge('src/main.js').then((res) => {
    console.log(res.circular());
}); */