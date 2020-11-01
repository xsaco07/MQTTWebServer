var canvasContext = document.getElementById('waterXRoom').getContext('2d');

var waterXRoom = new Chart(canvasContext, {
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
            text: "Consumo de agua por habitacion"
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

const loadWaterXRoomChart = (serverData) => {
    for (_id of Object.keys(serverData)){
        const object = serverData[_id];
        const roomNumber = parseInt(_id);
        let index = getElementIndex(`Hab-${roomNumber}`, waterXRoom);
        if(index == -1){
            waterXRoom.data.labels.push(`Hab-${roomNumber}`);
            waterXRoom.data.datasets[0].data.push(object.consumption);
        }
        else waterXRoom.data.datasets[0].data[index] += object.consumption;
    }
    waterXRoom.update();
};

socket.on('waterXRoom', function(data){
    let index = getElementIndex(`Hab-${data._id}`, waterXRoom);
    if(index == -1){
        waterXRoom.data.labels.push(`Hab-${data._id}`);
        waterXRoom.data.datasets[0].data.push(data.consumption);
    }
    else waterXRoom.data.datasets[0].data[index] += data.consumption;
    waterXRoom.update();
});