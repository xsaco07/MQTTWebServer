// Todo: implement this logic
const isValidObject = (object) => true;

module.exports.buildTotalsEntity = (
    sensorName,
    totalFlowMetersWaterConsume,
    totalTowelsWaterConsume,
    totalWaterConsume,
    totalWaterConsumeTime,
    totalWeight,
    totalTowels
) => {
    const object = Object.freeze({
        sensorName,
        totalFlowMetersWaterConsume,
        totalTowelsWaterConsume,
        totalWaterConsume,
        totalWaterConsumeTime,
        totalWeight,
        totalTowels
    });
    if(isValidObject(object)) return object;
};