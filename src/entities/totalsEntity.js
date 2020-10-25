// Todo: implement this logic
const isValidObject = (object) => true;

module.exports.buildTotalsEntity = (totalTowels, totalWater) => {
    const object = Object.freeze({
        towels : totalTowels,
        water : totalWater,
        total : totalTowels.consumption + totalWater.consumption
    });
    if(isValidObject(object)) return object;
};