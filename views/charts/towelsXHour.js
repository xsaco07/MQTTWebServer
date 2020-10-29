var canvasContext = document.getElementById('towelsXHour').getContext('2d');

var towelsXHour = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['00:00', '01:00', '02:00','03:00','04:00','05:00',
                '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
                '13:00','14:00','15:00','16:00','17:00','18:00','19:00',
                '20:00','21:00','22:00','23:00'
        ],
        datasets: [{
            label: '# de Toallas',
            data: [120, 194, 324, 0, 0, 0, 0, 0, 0, 5, 104,
                   45, 256, 0, 0, 0, 63, 0, 44, 4, 0, 0, 0, 66],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de toallas por hora del día"
        }
    }
});