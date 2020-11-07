var waterXHourCanvas = document.getElementById('waterXHour').getContext('2d');

const waterXHour = new Chart(waterXHourCanvas, {
    type: 'line',
    data: {
        labels: ['00:00', '01:00', '02:00','03:00','04:00','05:00',
                '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
                '13:00','14:00','15:00','16:00','17:00','18:00','19:00',
                '20:00','21:00','22:00','23:00'
        ],
        datasets: [{
            label: 'Litros de agua',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgb(39, 33, 146, 0.85)',
            borderWidth: 2,
            borderColor : 'rgb(39, 33, 146, 0.85)',
            hoverBackgroundColor : 'rgb(39, 33, 146, 0.6)',
            fill : false
        }]
    },
    options: {
        title: {
            display : true,
            padding : 20,
            fontSize : 24,
            fontStyle : "normal",
            fontColor : 'rgb(1,34,65)',
            text: "Consumo de agua por hora (hoy)",
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
                    padding : 20
                },
                gridLines : {
                    
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

const loadWaterXHourChart = (serverData) => {
    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id+':00', waterXHour);
        waterXHour.data.datasets[0].data[index] += object.consumption;
    }
    waterXHour.update();
};

socket.on('waterXHour', function(object){
    let index = getElementIndex(object._id+':00', waterXHour);
    waterXHour.data.datasets[0].data[index] += object.consumption;
    waterXHour.update();
});