// Todo: implement this logic
const isValidObject = (object) => true;

module.exports.buildTotalTowelsConsumptionEntity = (totalTowelsConumptionInputObject) => {
    if(isValidObject(totalTowelsConumptionInputObject)) {
        const object = {
            _id : totalTowelsConumptionInputObject._id,
            towels : totalTowelsConumptionInputObject.towels,
            weight : totalTowelsConumptionInputObject.weight,
            consumption : totalTowelsConumptionInputObject.consumption
        };
        return object;
    }
    else console.log("Error: parameter object is not a valid one");
};