const factories = require('../entities/factories');

class Total {
    constructor(sensorName) {
        this.sensorName = sensorName;
        this.LAST_TOWEL_TOTALS = factories.buildTotalTowelsConsumptionEntity({
            towels : 0,
            weight : 0.00,
            consumption : 0.00
        });
    
        this.LAST_WATER_TOTALS = factories.buildTotalWaterConsumptionEntity({
            consumption : 0.00,
            seconds : 0
        });
    }

    get LAST_TOTALS() {
        return factories.buildTotalsEntity(this.LAST_TOWEL_TOTALS, this.LAST_WATER_TOTALS);
    }

    reset() {
        this.LAST_TOWEL_TOTALS = factories.buildTotalTowelsConsumptionEntity({
            towels : 0,
            weight : 0.00,
            consumption : 0.00
        });
        this.LAST_WATER_TOTALS = factories.buildTotalWaterConsumptionEntity({
            consumption : 0.00,
            seconds : 0
        });
    }

    increseTowelsTotals(consumption, towels, weight) {
        this.LAST_TOWEL_TOTALS.consumption += consumption;
        this.LAST_TOWEL_TOTALS.towels += towels;
        this.LAST_TOWEL_TOTALS.weight += weight;
    }

    increaseWaterTotals(consumption, seconds) {
        this.LAST_WATER_TOTALS.consumption += consumption;
        this.LAST_WATER_TOTALS.seconds += seconds;
    }

}

module.exports.Total = Total;