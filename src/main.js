// Requirements
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socket = require('./socketEvents/sockets');

// Routes
const roomRoutes = require('./routes/roomRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const checkInRoutes = require('./routes/checkInRoutes');
const checkOutRoutes = require('./routes/checkOutRoutes');
const guestRoutes = require('./routes/guestRoutes');
const totalRoutes = require('./routes/totalRoutes');
const towelConsumptionRoutes = require('./routes/towelConsumptionRoutes');
const waterConsumptionRoutes = require('./routes/waterConsumptionRoutes');

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

socket.connect(server);

// Render tables
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/guests/', async (req, res, next) => {
    const guests = await useCases.guestUseCases.getGuests();
    res.render('tables/guests', {guests});
});

app.get('/rooms/', async (req, res, next) => {
    const rooms = await useCases.roomUseCases.getRooms();
    res.render('tables/rooms', {rooms});
});

app.get('/checkIns/', async (req, res, next) => {
    const checkIns = await useCases.checkInUseCases.getCheckIns();
    res.render('tables/checkIns', {checkIns});
});

app.get('/sensors/', async (req, res, next) => {
    const sensors = await useCases.espSensorUseCases.getEspSensors();
    res.render('tables/sensors', {sensors});
});

app.get('/totals/', async (req, res, next) => {
    const totals = await useCases.totalUseCases.getTotals();
    res.render('tables/totals', {totals});
});

app.get('/checkOuts/', async (req, res, next) => {
    const checkOuts = await useCases.checkOutUseCases.getCheckOuts();
    res.render('tables/checkOuts', {checkOuts});
});

app.get('/unexpectedTowel/', async (req, res, next) => {
    const consumptions = await useCases.towelConsumptionUseCases.getTowelConsumptionsByExpectedState({
        expected : false
    });
    res.render('tables/unexpectedTowel', {consumptions});
});

app.get('/unexpectedWater/', async (req, res, next) => {
    const consumptions = await useCases.waterConsumptionUseCases.getWaterConsumptionsByExpectedState({
        expected : false
    });
    res.render('tables/unexpectedWater', {consumptions});
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