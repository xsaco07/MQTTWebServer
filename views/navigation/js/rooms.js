const towelsByRoomEndPoint = '/api/towelConsumption/room/true/';
const waterByRoomEndPoint = '/api/waterConsumption/room/true/';

window.addEventListener('load', async function () {

    try {

        let jsonData = {};

        const [
            towelByRoomResponse,
            waterByRoomResponse
        ] = await Promise.all([
            fetch(towelsByRoomEndPoint),
            fetch(waterByRoomEndPoint)
        ]);

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
