const makeDB = require('../../data-access/mongodb');
const { getDocsByDateRange } = require('./towelsConsumeController');
const towelsController = require('./towelsConsumeController');

makeDB()
.then(() => {console.log(`Database connection success!`);})
.catch((err) => {console.log(`An error has occured: ${err}`);});

const saveDoc = () => {
    const date = new Date('2020-09-12 21:58:00 UTC');
    const message = `{"sensorName" : "ESPSensor02",
    "towels" : 2,
    "weight" : 1000,
    "consumption" : 240,
    "date" : "${date.toLocaleString()}"}`;
    console.log(`Message : ${message}`);
    towelsController.saveDoc(message)
};

const getDocs = async () => {
    const docs = await towelsController.getDocs();
    console.log(docs);
};

const getDocsByDates = async () => {
    const date1 = new Date('2020-09');
    const date2 = new Date('2020-09');
    console.log(date1, date2);
    const docs = await towelsController.getDocsByDateRange(date1, date2);
    console.log(docs);
};

const getDocsBySensorName = async () => {
    const sensorName = 'ESPSensor02';
    const docs = await towelsController.getDocsBySensorName(sensorName);
    console.log(docs);
};

getDocsByDates();