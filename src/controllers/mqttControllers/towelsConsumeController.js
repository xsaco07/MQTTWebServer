const {buildTowelConsumptionEntity} = require('../../entities/towelConsumptionEntity');

module.exports.saveTowelConsumption = async (message) => {
    const object = Object.freeze(JSON.parse(message));
    const towelConsumptionDocument = buildTowelConsumptionEntity(object);
    await towelConsumptionDocument.save((error) => {
        console.log(`An error has occured while saving the towelConsumptionDocument`);
        console.log(`Error: ${error}`);
    });
};