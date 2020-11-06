var towelsXHourCanvas = document.getElementById('towelsXHour').getContext('2d');

const towelsXHour = new Chart(towelsXHourCanvas, {
    type: 'line',
    data: {
        labels: ['00:00', '01:00', '02:00','03:00','04:00','05:00',
                '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
                '13:00','14:00','15:00','16:00','17:00','18:00','19:00',
                '20:00','21:00','22:00','23:00'
        ],
        datasets: [{
            label: '# de Toallas',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2,
            borderColor : 'rgb(1,34,65)',
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
            text: "Consumo de toallas por hora (hoy)",
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

const loadTowelsXHourChart = (serverData) => {
    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id+':00', towelsXHour);
        towelsXHour.data.datasets[0].data[index] += object.towels;
    }
    towelsXHour.update();
};

socket.on('towelsXHour', function(object){
    let index = getElementIndex(object._id+':00', towelsXHour);
    towelsXHour.data.datasets[0].data[index] += object.towels;
    towelsXHour.update();
});