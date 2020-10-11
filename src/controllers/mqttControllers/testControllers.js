const makeDB = require('../../data-access/mongodb');
const towelsController = require('./towelsConsumeController');
const waterController = require('./waterConsumeController');

makeDB()
.then(() => {console.log(`Database connection success!`);})
.catch((err) => {console.log(`An error has occured: ${err}`);});

const saveTowelsDoc = async () => {
    const date = new Date('2020-09-12 21:58:00 UTC');
    const message = `{"sensorName" : "ESPSensor02",
    "towels" : 2,
    "weight" : 1000,
    "consumption" : 240,
    "date" : "${date.toLocaleString()}"}`;
    console.log(`Message : ${message}`);
    await towelsController.saveDoc(message)
};

const getTowelsDocs = async () => {
    const docs = await towelsController.getDocs();
    console.log(docs);
};

const getTowelsDocsByDates = async () => {
    const date1 = new Date('2020-09');
    const date2 = new Date('2020-09');
    console.log(date1, date2);
    const docs = await towelsController.getDocsByDateRange(date1, date2);
    console.log(docs);
};

const getTowelsDocsBySensorName = async () => {
    const sensorName = 'ESPSensor02';
    const docs = await towelsController.getDocsBySensorName(sensorName);
    console.log(docs);
};

//------------------------------------------------------------------

const saveWaterDoc = async () => {
    const date = new Date('2020-11-12 21:58:00 UTC');
    const message = `{"sensorName" : "ESPSensor04",
    "consumption" : 240,
    "seconds" : 800,
    "date" : "${date.toLocaleString()}"}`;
    console.log(`Message : ${message}`);
    await waterController.saveDoc(message);
};

const getWaterDocs = async () => {
    const docs = await waterController.getDocs();
    console.log(docs);
};

const getWaterDocsByDates = async (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    console.log(date1, date2);
    const docs = await waterController.getDocsByDateRange(date1, date2);
    console.log(docs);
};

const getWaterDocsBySensorName = async () => {
    const sensorName = 'ESPSensor04';
    const docs = await waterController.getDocsBySensorName(sensorName);
    console.log(docs);
};