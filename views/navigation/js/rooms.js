const roomConsumptionEndPoint = '/api/total/';

window.addEventListener('load', async function () {

    try {

        let jsonData = {};

        const response = await fetch(roomConsumptionEndPoint);

        if(response.status == 200) {
            jsonData = await response.json();
            loadWaterXRoomChart(jsonData);
            loadTowelsWeightXRoomChart(jsonData);
        }

    } catch (error) { console.log(`Error: ${error}`); }
}, false);
