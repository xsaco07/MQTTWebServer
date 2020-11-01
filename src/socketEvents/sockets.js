const socketIo = require('socket.io');

let io = null;

const getAgeIndex = (age) => {
    index = 0;
    if(age < 20) index = 0;
    else if (age >= 20 && age <= 30) index = 1;
    else if(age >= 31 && age <= 40) index = 2;
    else if(age >= 41 && age <= 50) index = 3;
    else if(age >= 51 && age <= 60) index = 4;
    else if(age >= 61 && age <= 70) index = 5;
    else if(age > 70) index = 6;
    return index;
};

module.exports = {

    connect : (server) => {
        console.log('Connecting socket...');
        io = socketIo(server);
        io.on('connection', (socket) => {
            console.log("New connection");
            socket.on('disconnect', () => console.log(`User ${socket.id} disconnected`));
        });
    },

    emitTowelsXAge : (age, towels, consumption) => {
        console.log('Emitting towelsXAge message through socket...');
        const message = {
            index : getAgeIndex(age),
            towels,
            consumption
        };
        console.log(message);
        io.emit('towelsXAge', message);
    },

    emitTowelsXCountry : (country, towels, consumption) => {
        console.log('Emitting towelsXCountry message through socket...');
        const message = {
            country,
            towels,
            consumption
        };
        console.log(message);
        io.emit('towelsXCountry', message);
    },

    emitTowelsXDay : (towels, consumption, date) => {
        console.log('Emitting towelsXDay message through socket...');
        const message = {
            towels,
            consumption,
            _id : date
        };
        console.log(message);
        io.emit('towelsXDay', message);
    },

    emitTowelsXHour : (towels, consumption, hour) => {
        console.log('Emitting towelsXHour message through socket...');
        const message = {
            towels,
            consumption,
            _id : hour
        };
        console.log(message);
        io.emit('towelsXHour', message);
    },

    emitTowelsXRoom : (towels, consumption, roomNumber, roomOccupancyState) => {
        console.log('Emitting towelsXRoom message through socket...');
        const message = {
            towels,
            consumption,
            roomOccupancyState,
            _id : roomNumber
        };
        console.log(message);
        io.emit('towelsXRoom', message);
    },

    emitWaterXAge : (age, consumption) => {
        console.log('Emitting waterXAge message through socket...');
        const message = {
            index : getAgeIndex(age),
            consumption
        };
        console.log(message);
        io.emit('waterXAge', message);
    },

    emitWaterXCountry : (country, consumption) => {
        console.log('Emitting waterXCountry message through socket...');
        const message = {
            country,
            consumption
        };
        console.log(message);
        io.emit('waterXCountry', message);
    },

    emitWaterXDay : (consumption, seconds, date) => {
        console.log('Emitting waterXDay message through socket...');
        const message = {
            consumption,
            seconds,
            _id : date
        };
        console.log(message);
        io.emit('waterXDay', message);
    },

    emitWaterXHour : (consumption, seconds, hour) => {
        console.log('Emitting waterXHour message through socket...');
        const message = {
            consumption,
            seconds,
            _id : hour
        };
        console.log(message);
        io.emit('waterXHour', message);
    },

};