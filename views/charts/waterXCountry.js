
const waterXCountryCanvas = document.getElementById('waterXCountry').getContext('2d');
const waterXCountry = new Chart(waterXCountryCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Litros de agua',
            data: [],
            backgroundColor: 'rgb(39, 33, 146, 0.85)',
            borderWidth: 1,
            borderColor : 'rgb(0,0,0)',
            hoverBackgroundColor : 'rgb(39, 33, 146, 0.6)'
        }]
    },
    options: {
        title: {
            display : true,
            padding : 20,
            fontSize : 24,
            fontStyle : "normal",
            text: "Consumo de agua por nacionalidad"
        },
        legend: {
            display: true,
            labels: {
                fontSize : 18
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontSize : 15,
                    padding : 20,
                }
            }],
            xAxes: [{
                ticks: {
                    fontSize : 15,
                },
                gridLines : {
                    display : false
                }
            }]
        }
    }
});

const loadWaterXCountryChart = (serverData) => {
    for (total of Object.values(serverData)){
        const guestCountry = total.checkIn_id.guest_id.country;
        let index = getElementIndex(guestCountry, waterXCountry);
        if(index == -1){
            waterXCountry.data.labels.push(guestCountry);
            waterXCountry.data.datasets[0].data.push(total.totals.water.consumption);
        }
        else waterXCountry.data.datasets[0].data[index] += total.totals.water.consumption;
    }
    waterXCountry.update();
};

socket.on('waterXCountry', function(data){
    let index = getElementIndex(data.country, waterXCountry);
    if(index == -1){
        waterXCountry.data.labels.push(data.country);
        waterXCountry.data.datasets[0].data.push(data.consumption);
        index = waterXCountry.data.datasets[0].data.length - 1;
    }
    else waterXCountry.data.datasets[0].data[index] += data.consumption;
    waterXCountry.update();
});