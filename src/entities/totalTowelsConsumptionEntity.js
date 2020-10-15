// Todo: implement this logic
const isValidObject = (object) => true;

module.exports.buildTotalTowelsConsumptionEntity = (totalTowelsConumptionInputObject) => {
    const object = Object.freeze({
        towels : totalTowelsConumptionInputObject.towels,
        weight : totalTowelsConumptionInputObject.weight,
        consumption : totalTowelsConumptionInputObject.consumption
    });
    if(isValidObject(object)) return object;
};