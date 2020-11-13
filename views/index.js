const CONS_LAST_DAYS = 7;
const towelByDayEndPoint = `/api/towelConsumption/day/${CONS_LAST_DAYS}`;
const waterByDayEndPoint = `/api/waterConsumption/day/${CONS_LAST_DAYS}`;

// Get todays date formatted to yyyy-mm-dd
const date = new Date();
date.setHours(date.getHours() - new Date().getTimezoneOffset()/60);
const formmattedDate = date.toISOString().slice(0, 10);

const towelByHourEndPoint = `/api/towelConsumption/hour/${formmattedDate}/`;
const waterByHourEndPoint = `/api/waterConsumption/hour/${formmattedDate}/`;

window.addEventListener('load', function () {

    try {
        fetchAndLoadTowelsWeightXDay(towelByDayEndPoint, formmattedDate);
        fetchAndLoadTowelsWeightXHour(towelByHourEndPoint);
        fetchAndLoadWaterXDay(waterByDayEndPoint, formmattedDate);
        fetchAndLoadWaterXHour(waterByHourEndPoint);

    } catch (error) {
        console.log(`Error: ${error}`); 
    }

}, false);

async function fetchAndLoadTowelsWeightXDay(endPoint, lastDayConsidered) {
    let jsonData = {};
    try {
        const towelByDayResponse = await fetch(endPoint);
        if(towelByDayResponse.status == 200) {
            jsonData = await towelByDayResponse.json();
            loadTowelsWeightXDayChart(jsonData, lastDayConsidered);
        }   
    } catch (error) {
        console.log(`Error fetching: ${error}`);
    }
}

async function fetchAndLoadTowelsWeightXHour(endPoint) {
    let jsonData = {};
    try {
        const towelByHourResponse = await fetch(endPoint);
        if(towelByHourResponse.status == 200) {
            jsonData = await towelByHourResponse.json();
            loadTowelsWeightXHourChart(jsonData);
        }
    } catch (error) {
        console.log(`Error fetching: ${error}`);
    }
}

async function fetchAndLoadWaterXDay(endPoint, lastDayConsidered) {
    let jsonData = {};
    try {
        const waterByDayResponse = await fetch(endPoint);
        if(waterByDayResponse.status == 200) {
            jsonData = await waterByDayResponse.json();
            loadWaterXDayChart(jsonData, lastDayConsidered);
        }
    } catch (error) {
        console.log(`Error fetching: ${error}`);
    }
}

async function fetchAndLoadWaterXHour(endPoint) {
    let jsonData = {};
    try {
        const waterByHourResponse = await fetch(endPoint);
        if(waterByHourResponse.status == 200) {
            jsonData = await waterByHourResponse.json();
            loadWaterXHourChart(jsonData);
        }
    } catch (error) {
        console.log(`Error fetching: ${error}`);
    }

}

// Metrics
socket.on('waterMetric', function(object) {
    $(document).ready(function(){
        $('#waterMetric').text((Math.round(object.consumption)) + ' lts');
        $('#waterTimeMetric').text((Math.round(object.seconds / 60)) + ' min');
      });
});

socket.on('towelsMetric', function(object) {
    $(document).ready(function(){
        $('#towelWeightMetric').text((Math.round(object.weight / 1000)) + ' kgs');
      });
});