var canvasContext = document.getElementById('waterXDay').getContext('2d');

var waterXDay = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['09-Nov','10-Nov','11-Nov','12-Nov','13-Nov','14-Nov'],
        datasets: [{
            label: 'Mililtros consumidos',
            data: [1200, 19454, 3254, 5545, 104544, 45566],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de agua por día"
        }
    }
});