
const waterXCountryCanvas = document.getElementById('waterXCountry').getContext('2d');
const waterXCountry = new Chart(waterXCountryCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Litros de agua',
            data: [],
            backgroundColor: 'rgb(171,202,183)',
            borderWidth: 2,
            borderColor : 'rgb(1,34,65)',
            hoverBackgroundColor : 'rgb(1,34,65)'
        }]
    },
    options: {
        title: {
            display : true,
            padding : 20,
            fontSize : 24,
            fontStyle : "normal",
            fontColor : 'rgb(1,34,65)',
            text: "Consumo de agua por nacionalidad"
        },
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(1,34,65)',
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
    for (guestData of Object.values(serverData)){
        const guestCountry = guestData.guest.country;
        let index = getElementIndex(guestCountry, waterXCountry);
        if(index == -1){
            waterXCountry.data.labels.push(guestCountry);
            waterXCountry.data.datasets[0].data.push(guestData.consumption);
        }
        else waterXCountry.data.datasets[0].data[index] += guestData.consumption;
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