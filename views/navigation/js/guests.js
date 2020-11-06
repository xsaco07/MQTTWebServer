const towelByGuestEndPoint = 'http://localhost:3000/api/towelConsumption/guest/';
const waterByGuestEndPoint = 'http://localhost:3000/api/waterConsumption/guest/';

window.addEventListener('load', async function () {

    try {

        let jsonData = {};

        const [
            towelByGuestResponse, 
            waterByGuestResponse
        ] = await Promise.all([
            fetch(towelByGuestEndPoint),
            fetch(waterByGuestEndPoint)
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

    } catch (error) { console.log(`Error: ${error}`); }
}, false);
