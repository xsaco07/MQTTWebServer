// Requirements
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

// Routes
const roomRoutes = require('./routes/roomRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const checkInRoutes = require('./routes/checkInRoutes');
const checkOutRoutes = require('./routes/checkOutRoutes');
const guestRoutes = require('./routes/guestRoutes');

const {makeDB} = require('./data-access/mongodb');

// Express settings
const app = express();
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes set up
app.use('/room', roomRoutes);
app.use('/sensor', sensorRoutes);
app.use('/guest', guestRoutes);
app.use('/checkIn', checkInRoutes);
app.use('/checkOut', checkOutRoutes);

// Static Files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, '../views')));

// Mongo connection
makeDB();

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

