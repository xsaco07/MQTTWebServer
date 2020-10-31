let waterXCountry = null;

const loadWaterXCountryChart = (serverData) => {
    const canvasContext = document.getElementById('waterXCountry').getContext('2d');
    waterXCountry = new Chart(canvasContext, {
        type: 'horizontalBar',
        data: {
            labels: [],
            datasets: [{
                label: 'Litros de agua',
                data: [],
                backgroundColor: 'rgb(1,34,65,0.5)',
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: "Consumo de agua por país"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    for (guestData of Object.values(serverData)){
        const guestCountry = guestData.guest.country;
        let index = getCountryIndex(guestCountry, waterXCountry);
        if(index == -1){
            waterXCountry.data.labels.push(guestCountry);
            waterXCountry.data.datasets[0].data.push(guestData.consumption);
            index = waterXCountry.data.datasets[0].data.length - 1;
        }
        else waterXCountry.data.datasets[0].data[index] += guestData.consumption;
    }
    waterXCountry.update();
};

socket.on('waterXCountry', function(data){
    let index = getCountryIndex(data.country, waterXCountry);
    if(index == -1){
        waterXCountry.data.labels.push(data.country);
        waterXCountry.data.datasets[0].data.push(data.consumption);
        index = waterXCountry.data.datasets[0].data.length - 1;
    }
    else waterXCountry.data.datasets[0].data[index] += data.consumption;
    waterXCountry.update();
});