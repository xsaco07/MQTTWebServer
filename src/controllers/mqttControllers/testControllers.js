const { makeDB, closeDB } = require('../../data-access/mongodb');
const towelsUseCases = require('../../use-cases/towelConsumptionUseCases');
const waterUseCases = require('../../use-cases/waterConsumptionUseCases');

makeDB();

const saveTowelsDoc = async () => {
    const message = `{"sensorName" : "ESPSensor02",
    "towels" : 2,
    "weight" : 1000,
    "consumption" : 240}`;
    await towelsUseCases.saveDoc(message);
};

saveTowelsDoc();

const getTowelsDocs = async () => {
    const docs = await towelsUseCases.getDocs();
    console.log(docs.length);
};

const getTowelsDocsByDates = async () => {
    const date1 = new Date('2020-09');
    const date2 = new Date('2020-09');
    console.log(date1, date2);
    const docs = await towelsUseCases.getDocsByDateRange(date1, date2);
    console.log(docs);
};

const getTowelsDocsBySensorName = async () => {
    const sensorName = 'ESPSensor02';
    const docs = await towelsUseCases.getDocsBySensorName(sensorName);
    console.log(docs);
};

//------------------------------------------------------------------

const saveWaterDoc = async () => {
    const message = `{"sensorName" : "ESPSensor04",
    "consumption" : 240,
    "seconds" : 800,
    "date" : "2020-10-17 14:42:00 UTC"}`;
    console.log(`Message : ${message}`);
    await waterUseCases.saveDoc(message);
};

const getWaterDocs = async () => {
    const docs = await waterUseCases.getDocs();
    console.log(docs);
};

const getWaterDocsByDates = async (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    console.log(date1, date2);
    const docs = await waterUseCases.getDocsByDateRange(date1, date2);
    console.log(docs);
};

const getWaterDocsBySensorName = async () => {
    const sensorName = 'ESPSensor04';
    const docs = await waterUseCases.getDocsBySensorName(sensorName);
    console.log(docs);
};

//-----------------------------------------------------------

const totals = async () => {
    console.log(await towelsUseCases.getTotalTowelsConsumptionByRoomId('5f82022e584db00f057e0b9c'));
    console.log(await waterUseCases.getTotalWaterConsumptionByRoomId('5f82022e584db00f057e0b9f'));
};