let waterXAge = null;

const loadWaterXAgeChart = (serverData) => {
    console.log('Loading chart...');
    const canvasContext = document.getElementById('waterXAge').getContext('2d');
    waterXAge = new Chart(canvasContext, {
        type: 'bar',
        data: {
            labels: ['< 20','20 - 30','31 - 40','41 - 50','51 - 60','61 - 70', '> 70'],
            datasets: [{
                label: 'Litros de agua',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgb(1,34,65,0.5)',
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: "Consumo de agua por edad"
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
        waterXAge.data.datasets[0].data[index] += guestData.consumption;
    }

    waterXAge.update();
};

socket.on('waterXAge', function(data){
    waterXAge.data.datasets[0].data[data.index] += data.consumption;
    waterXAge.update();
});