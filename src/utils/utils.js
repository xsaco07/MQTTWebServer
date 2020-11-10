module.exports.isEmpty = (object) => Object.keys(object).length === 0;
module.exports.offsetUTCHours = new Date().getTimezoneOffset()/60;