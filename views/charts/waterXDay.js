let waterXDay = null;

const loadWaterXDayChart = (serverData) => {
    const canvasContext = document.getElementById('waterXDay').getContext('2d');
    waterXDay = new Chart(canvasContext, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Litros de agua',
                data: [],
                backgroundColor: 'rgb(1,34,65,0.5)',
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: "Consumo de agua por día"
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

    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id, waterXDay);
        if(index == -1){
            waterXDay.data.labels.push(object._id);
            waterXDay.data.datasets[0].data.push(object.consumption);
        }
        else waterXDay.data.datasets[0].data[index] += object.consumption;
    }
    waterXDay.update();
};

socket.on('waterXDay', function(object){
    let index = getElementIndex(object._id, waterXDay);
    if(index == -1){
        waterXDay.data.labels.push(object._id);
        waterXDay.data.datasets[0].data.push(object.consumption);
    }
    else waterXDay.data.datasets[0].data[index] += object.consumption;
    waterXDay.update();
});