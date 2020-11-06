let socket = io();

const towelByGuestEndPoint = 'http://localhost:3000/api/towelConsumption/guest/';
const waterByGuestEndPoint = 'http://localhost:3000/api/waterConsumption/guest/';
const towelByDayEndPoint = 'http://localhost:3000/api/towelConsumption/day/';
const waterByDayEndPoint = 'http://localhost:3000/api/waterConsumption/day/';
const towelsByRoomEndPoint = 'http://localhost:3000/api/towelConsumption/room/true/';
const waterByRoomEndPoint = 'http://localhost:3000/api/waterConsumption/room/true/';

// Get todays date formatted to yyyy-mm-dd
const date = new Date();
date.setHours(date.getHours() - new Date().getTimezoneOffset()/60);
const formmatedDate = date.toISOString().slice(0, 10);

const towelByHourEndPoint = `http://localhost:3000/api/towelConsumption/hour/${formmatedDate}/`;
const waterByHourEndPoint = `http://localhost:3000/api/waterConsumption/hour/${formmatedDate}/`;

window.addEventListener('load', async function () {

    try {

        let jsonData = {};

        const [
            towelByGuestResponse, 
            waterByGuestResponse, 
            towelByDayResponse,
            towelByHourResponse,
            waterByDayResponse,
            waterByHourResponse,
            towelByRoomResponse,
            waterByRoomResponse
        ] = await Promise.all([
            fetch(towelByGuestEndPoint),
            fetch(waterByGuestEndPoint),
            fetch(towelByDayEndPoint),
            fetch(towelByHourEndPoint),
            fetch(waterByDayEndPoint),
            fetch(waterByHourEndPoint),
            fetch(towelsByRoomEndPoint),
            fetch(waterByRoomEndPoint)
        ]);

        if(towelByGuestResponse.status == 200) {
            jsonData = await towelByGuestResponse.json();
            loadTowelsXAgeChart(jsonData);
            loadTowelsXCountryChart(jsonData);
        }
        if(waterByGuestResponse.status == 200) {
            jsonData = await waterByGuestResponse.json();
            loadWaterXAgeChart(jsonData);
            loadWaterXCountryChart(jsonData);
        }
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
        if(towelByRoomResponse.status == 200) {
            jsonData = await towelByRoomResponse.json();
            loadTowelsXRoomChart(jsonData);
        }
        if(waterByRoomResponse.status == 200) {
            jsonData = await waterByRoomResponse.json();
            loadWaterXRoomChart(jsonData);
        }

    } catch (error) { console.log(`Error: ${error}`); }
}, false);
