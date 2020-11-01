let towelsXCountry = null;

const loadTowelsXCountryChart = (serverData) => {
    const canvasContext = document.getElementById('towelsXCountry').getContext('2d');
    towelsXCountry = new Chart(canvasContext, {
        type: 'horizontalBar',
        data: {
            labels: [],
            datasets: [{
                label: '# de Toallas',
                data: [],
                backgroundColor: 'rgb(1,34,65,0.5)',
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: "Consumo de toallas por país"
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    for (guestData of Object.values(serverData)){
        const guestCountry = guestData.guest.country;
        let index = getElementIndex(guestCountry, towelsXCountry);
        if(index == -1){
            towelsXCountry.data.labels.push(guestCountry);
            towelsXCountry.data.datasets[0].data.push(guestData.towels);
            index = towelsXCountry.data.datasets[0].data.length - 1;
        }
        else towelsXCountry.data.datasets[0].data[index] += guestData.towels;
    }
    towelsXCountry.update();
};

socket.on('towelsXCountry', function(data){
    let index = getElementIndex(data.country, towelsXCountry);
    if(index == -1){
        towelsXCountry.data.labels.push(data.country);
        towelsXCountry.data.datasets[0].data.push(data.towels);
        index = towelsXCountry.data.datasets[0].data.length - 1;
    }
    else towelsXCountry.data.datasets[0].data[index] += data.towels;
    towelsXCountry.update();
});