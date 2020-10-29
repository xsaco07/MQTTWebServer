var canvasContext = document.getElementById('waterXCountry').getContext('2d');

var waterXCountry = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: ['Costa Rica','Estados Unidos','Panamá','Mexico','España','Japón'],
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
            text: "Consumo de agua por nacionalidad"
        }
    }
});