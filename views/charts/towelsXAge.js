var socket = io();

var canvasContext = document.getElementById('towelsXAge').getContext('2d');

var towelsXAge = new Chart(canvasContext, {
    type: 'line',
    data: {
        labels: ['< 20','20 - 30','31 - 40','41 - 50','51 - 60','61 - 70', '> 70'],
        datasets: [{
            label: '# de Toallas',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Consumo de toallas por edad"
        }
    }
});

socket.on('towelsXAge', function(data){
    console.log(data);
    towelsXAge.data.datasets[0].data[data.index] += data.towels;
    towelsXAge.update();
});