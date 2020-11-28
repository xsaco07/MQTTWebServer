const guestConsumptionEndPoint = '/api/total/';

window.addEventListener('load', async function () {

    try {

        let jsonData = {};

        const response = await fetch(guestConsumptionEndPoint);

        if(response.status == 200) {
            jsonData = await response.json();
            loadTowelsWeightXAgeChart(jsonData);
            loadTowelsWeightXCountryChart(jsonData);
            loadWaterXAgeChart(jsonData);
            loadWaterXCountryChart(jsonData);
        }

    } catch (error) { console.log(`Error: ${error}`); }
}, false);
