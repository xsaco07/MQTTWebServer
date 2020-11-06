
const waterXAgeCanvas = document.getElementById('waterXAge').getContext('2d');
const waterXAge = new Chart(waterXAgeCanvas, {
    type: 'bar',
    data: {
        labels: ['< 20','20 - 30','31 - 40','41 - 50','51 - 60','61 - 70', '> 70'],
        datasets: [{
            label: 'Litros de agua',
            data: [0, 0, 0, 0, 0, 0, 0],
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
            text: "Consumo de agua por edad"
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

const loadWaterXAgeChart = (serverData) => {
    for (guestData of Object.values(serverData)){
        const index = getAgeIndex(guestData.guest.age);
        waterXAge.data.datasets[0].data[index] += guestData.consumption;
    }
    waterXAge.update();
};

socket.on('waterXAge', function(data){
    waterXAge.data.datasets[0].data[data.index] += data.consumption;
    waterXAge.update();
});