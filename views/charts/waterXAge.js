var canvasContext = document.getElementById('waterXAge').getContext('2d');

var waterXAge = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['< 20','20 - 30','31 - 40','41 - 50','51 - 60','61 - 70', '> 70'],
        datasets: [{
            label: 'Mililtros consumidos',
            data: [1200, 19454, 3254, 5545, 104544, 45566, 233],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de agua por edad"
        }
    }
});