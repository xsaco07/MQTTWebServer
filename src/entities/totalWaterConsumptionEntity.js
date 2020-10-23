// Todo: implement this logic
const isValidObject = (object) => true;

module.exports.buildTotalWaterConsumptionEntity = (totalWaterConsumptionInputObject) => {
    if(isValidObject(totalWaterConsumptionInputObject)) {
        const object = Object.freeze({
            consumption : totalWaterConsumptionInputObject.consumption,
            seconds : totalWaterConsumptionInputObject.seconds
        });
        return object;
    }
    else console.log("Error: parameter object is not a valid one");
};