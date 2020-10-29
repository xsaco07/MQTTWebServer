var canvasContext = document.getElementById('waterXHour').getContext('2d');

var waterXHour = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['00:00', '01:00', '02:00','03:00','04:00','05:00',
                '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
                '13:00','14:00','15:00','16:00','17:00','18:00','19:00',
                '20:00','21:00','22:00','23:00'
        ],
        datasets: [{
            label: 'Mililtros consumidos',
            data: [1200, 19454, 3254, 0, 0, 0, 0, 0, 0, 5545, 104544,
                   45552, 2556, 0, 0, 0, 5663, 0, 47564, 455, 0, 0, 0, 45566],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de agua por hora del día"
        }
    }
});