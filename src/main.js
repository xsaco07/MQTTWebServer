// Requirements
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socket = require('./socketEvents/sockets');

// Login and sessions
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./passport-config');

initializePassport(passport);

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

// Retrieve all use cases
const useCases = require('./use-cases/useCases');

// DB
const {makeDB} = require('./data-access/mongodb');

// MQTT
const mqtt = require('./mqtt/mqtt');

// Express settings
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Middleware HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// Middleware sessions
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


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

// Initi Mongo connection
makeDB();

// Start listening
const server = app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
    mqtt.connectClient();
    mqtt.listenToMQTTMessages();
    mqtt.setUpIntermitentTotalsCommunication();
});

// Init web sockets
socket.connect(server);

// Render tables
app.get('/', checkAuthenticated, async (req, res, next) => {
    let towelsMetric = (await useCases.towelConsumptionUseCases.metrics.totalConsumption())[0];
    let waterMetric = (await useCases.waterConsumptionUseCases.metrics.totalConsumption())[0];
    let activeCheckIns = await useCases.checkInUseCases.metrics.activeCheckIns();
    if (towelsMetric == undefined) towelsMetric = 0;
    if (waterMetric == undefined) waterMetric = 0;
    if (activeCheckIns == undefined) activeCheckIns = 0;
    // Send in-session user from passport authentication
    res.render('index', {towelsMetric, waterMetric, activeCheckIns, userDoc : req.user});
});

app.get('/login', checkNonAuthenticaded, async (req, res, next) => {
    res.render('forms/login');
});

app.get('/guests', checkAuthenticated, async (req, res, next) => {
    const guests = await useCases.guestUseCases.getGuests();
    res.render('navigation/ejs/guests', {guests, userDoc : req.user});
});

app.get('/rooms', checkAuthenticated, async (req, res, next) => {
    const rooms = await useCases.roomUseCases.getRooms();
    res.render('navigation/ejs/rooms', {rooms, userDoc : req.user});
});

app.get('/checkIns', checkAuthenticated, async (req, res, next) => {
    const checkIns = await useCases.checkInUseCases.getCheckIns();
    res.render('navigation/ejs/checkIns', {checkIns, userDoc : req.user});
});

app.get('/sensors', checkAuthenticated, async (req, res, next) => {
    const sensors = await useCases.espSensorUseCases.getEspSensors();
    res.render('navigation/ejs/sensors', {sensors, userDoc : req.user});
});

app.get('/totals', checkAuthenticated, async (req, res, next) => {
    const totals = await useCases.totalUseCases.getTotals();
    res.render('navigation/ejs/totals', {totals, userDoc : req.user});
});

app.get('/checkOuts', checkAuthenticated, async (req, res, next) => {
    const checkOuts = await useCases.checkOutUseCases.getCheckOuts();
    res.render('navigation/ejs/checkOuts', {checkOuts, userDoc : req.user});
});

app.get('/unexpected', checkAuthenticated, async (req, res, next) => {
    const waterConsumptions = await useCases.waterConsumptionUseCases.getWaterConsumptionsByExpectedState({
        expected : false
    });
    const towelConsumptions = await useCases.towelConsumptionUseCases.getTowelConsumptionsByExpectedState({
        expected : false
    });
    res.render('navigation/ejs/unexpected', {waterConsumptions, towelConsumptions});
});

// Render forms
app.get('/newCheckIn', checkAuthenticated, async (req, res, next) => {
    // Send available rooms to the form
    const rooms = await useCases.roomUseCases.getRoomsByOccupancyState({
        occupancyState : false
    });
    res.render('forms/newCheckIn', {rooms});
});

// Login/Logout
app.post('/login', checkNonAuthenticaded, passport.authenticate('local', {
    successRedirect: '/', // go home
    failureRedirect: '/login', // try to login again
    failureFlash: true
}));

app.post('/logout', checkAuthenticated, (req, res, next) => {
    req.logOut();
    res.redirect('/login');
});

// Landing page
app.get('/info', (req, res, next) => {
    res.render('navigation/ejs/info');
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
    return;
}

function checkNonAuthenticaded(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/');
        return;
    }
    return next();
};