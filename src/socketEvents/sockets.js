const socketIo = require('socket.io');

const constants = require('../utils/constants');

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
        io = socketIo(server);
        io.on('connection', (socket) => {
            console.log("New connection");
            socket.on('disconnect', () => console.log(`User ${socket.id} disconnected`));
        });
    },

    emitTowelsXAge : async (age, towels) => {
        console.log('Emitting message through socket...');
        const message = {
            index : getAgeIndex(age),
            towels
        };
        console.log(message);
        io.emit('towelsXAge', message);
    },

    emitWaterXAge : async (age, consumption) => {
        console.log('Emitting message through socket...');
        const message = {
            index : getAgeIndex(age),
            consumption
        };
        console.log(message);
        io.emit('waterXAge', message);
    }

};