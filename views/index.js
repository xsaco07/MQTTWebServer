const CONS_LAST_DAYS = 7;
const towelByDayEndPoint = `/api/towelConsumption/day/${CONS_LAST_DAYS}`;
const waterByDayEndPoint = `/api/waterConsumption/day/${CONS_LAST_DAYS}`;

// Get todays date formatted to yyyy-mm-dd
const TODAY = new Date();
TODAY.setHours(TODAY.getHours() - new Date().getTimezoneOffset()/60);
const TODAY_FORMATTED = TODAY.toISOString().slice(0, 10);

const towelByHourEndPoint = `/api/towelConsumption/hour/${TODAY_FORMATTED}/`;
const waterByHourEndPoint = `/api/waterConsumption/hour/${TODAY_FORMATTED}/`;

window.addEventListener('load', function () {

    try {
        fetchAndLoadTowelsWeightXDay(towelByDayEndPoint, TODAY_FORMATTED);
        fetchAndLoadTowelsWeightXHour(towelByHourEndPoint);
        fetchAndLoadWaterXDay(waterByDayEndPoint, TODAY_FORMATTED);
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