// Todo: implement this logic
const isValidObject = (object) => true;

module.exports.buildTotalWaterConsumptionEntity = (totalWaterConumptionInputObject) => {
    const object = Object.freeze({
        consumption : totalWaterConumptionInputObject.consumption,
        seconds : totalWaterConumptionInputObject.seconds
    });
    if(isValidObject(object)) return object;
};