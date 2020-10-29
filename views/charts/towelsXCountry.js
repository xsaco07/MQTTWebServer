var canvasContext = document.getElementById('towelsXCountry').getContext('2d');

var towelsXCountry = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['Costa Rica','Estados Unidos','Panamá','Mexico','España','Japón'],
        datasets: [{
            label: '# de Toallas',
            data: [1200, 19454, 3254, 5545, 104544, 45566],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de toallas por nacionalidad"
        }
    }
});