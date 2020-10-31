const socketIo = require('socket.io');

const constants = require('../utils/constants');

let io = null;

const getAgeIndex = (age) => {
    return Math.floor((age / constants.AGE_RANKS)-2);
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