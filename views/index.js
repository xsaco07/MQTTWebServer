const lastDays = 7;
const towelByDayEndPoint = `/api/towelConsumption/day/${lastDays}`;
const waterByDayEndPoint = `/api/waterConsumption/day/${lastDays}`;

// Get todays date formatted to yyyy-mm-dd
const date = new Date();
date.setHours(date.getHours() - new Date().getTimezoneOffset()/60);
const formmatedDate = date.toISOString().slice(0, 10);

const towelByHourEndPoint = `/api/towelConsumption/hour/${formmatedDate}/`;
const waterByHourEndPoint = `/api/waterConsumption/hour/${formmatedDate}/`;

window.addEventListener('load', async function () {

    try {

        let jsonData = {};

        const [
            towelByDayResponse,
            towelByHourResponse,
            waterByDayResponse,
            waterByHourResponse
        ] = await Promise.all([
            fetch(towelByDayEndPoint),
            fetch(towelByHourEndPoint),
            fetch(waterByDayEndPoint),
            fetch(waterByHourEndPoint)
        ]);

        if(towelByDayResponse.status == 200) {
            jsonData = await towelByDayResponse.json();
            loadTowelsXDayChart(jsonData);
        }
        if(towelByHourResponse.status == 200) {
            jsonData = await towelByHourResponse.json();
            loadTowelsXHourChart(jsonData);
        }
        if(waterByDayResponse.status == 200) {
            jsonData = await waterByDayResponse.json();
            loadWaterXDayChart(jsonData);
        }
        if(waterByHourResponse.status == 200) {
            jsonData = await waterByHourResponse.json();
            loadWaterXHourChart(jsonData);
        }

    } catch (error) { console.log(`Error: ${error}`); }
}, false);

// Metrics
socket.on('waterMetric', function(object) {
    $(document).ready(function(){
        $('#waterMetric').text((object.consumption) + ' lts');
        $('#waterTimeMetric').text((Math.round(object.seconds / 60)) + ' min');
      });
});

socket.on('towelsMetric', function(object) {
    $(document).ready(function(){
        $('#towelMetric').text(object.towels);
        $('#towelWeightMetric').text((object.weight / 1000) + ' kgs');
      });
});