var canvasContext = document.getElementById('towelsXRoom').getContext('2d');

var towelsXRoom = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['Hab-01', 'Hab-02', 'Hab-03', 'Hab-04', 'Hab-05'],
        datasets: [{
            label: '# de Toallas',
            data: [12, 19, 3, 5, 10],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Toallas por habitacion"
        }
    }
});