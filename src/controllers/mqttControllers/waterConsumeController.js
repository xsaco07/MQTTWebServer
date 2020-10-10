const {buildWaterConsumptionEntity} = require('../../entities/waterConsumptionEntity');

module.exports.saveWaterConsumption = async (message) => {
    const object = Object.freeze(JSON.parse(message));
    const waterConsumptionDocument = buildWaterConsumptionEntity(object);
    await waterConsumptionDocument.save((error) => {
        console.log(`An error has occured while saving the waterConsumptionDocument`);
        console.log(`Error: ${error}`);
    });
};