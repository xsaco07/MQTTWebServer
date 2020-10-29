var canvasContext = document.getElementById('towelsXDay').getContext('2d');

var towelsXDay = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['09-Nov','10-Nov','11-Nov','12-Nov','13-Nov','14-Nov'],
        datasets: [{
            label: '# de Toallas',
            data: [1200, 1944, 354, 545, 1045, 456],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de toallas por día"
        }
    }
});