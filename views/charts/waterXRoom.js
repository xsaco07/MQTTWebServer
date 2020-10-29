var canvasContext = document.getElementById('waterXRoom').getContext('2d');

var waterXRoom = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['Hab-01', 'Hab-02', 'Hab-03', 'Hab-04', 'Hab-05'],
        datasets: [{
            label: 'Mililtros de agua consumidos',
            data: [1200, 19633, 3000, 5520, 10056],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de agua por habitación"
        }
    }
});