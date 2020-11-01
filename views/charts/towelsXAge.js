let towelsXAge = null;

const loadTowelsXAgeChart = (serverData) => {
    console.log('Loading chart...');
    const canvasContext = document.getElementById('towelsXAge').getContext('2d');
    towelsXAge = new Chart(canvasContext, {
        type: 'bar',
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
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    for (guestData of Object.values(serverData)){
        const index = getAgeIndex(guestData.guest.age);
        towelsXAge.data.datasets[0].data[index] += guestData.towels;
    }

    towelsXAge.update();
};

socket.on('towelsXAge', function(data){
    towelsXAge.data.datasets[0].data[data.index] += data.towels;
    towelsXAge.update();
});