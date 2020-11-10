const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

const makeDB = async () => {
    try {
        await mongoose.connect(url, connectionOptions);
        console.log('Database connected');   
    } catch (error) {console.log(`Error connecting to the database: ${error}`);}
};
const closeDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Database disconnected');   
    } catch (error) {console.log(`Error disconnecting the database: ${error}`);}   
};

module.exports = {makeDB, closeDB};
