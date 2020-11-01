var canvasContext = document.getElementById('towelsXHour').getContext('2d');

const towelsXHour = new Chart(canvasContext, {
    type: 'bar',
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
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de toallas por hora del día"
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

const loadTowelsXHourChart = (serverData) => {
    console.log('loading');
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