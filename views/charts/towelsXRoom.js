var canvasContext = document.getElementById('towelsXRoom').getContext('2d');

var towelsXRoom = new Chart(canvasContext, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '# de Toallas',
            data: [],
            backgroundColor: 'rgb(1,34,65,0.5)',
            borderWidth: 2
        }]
    },
    options: {
        title: {
            display: true,
            text: "Toallas por habitacion"
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

const loadTowelsXRoomChart = (serverData) => {
    for (_id of Object.keys(serverData)){
        const object = serverData[_id];
        const roomNumber = parseInt(_id);
        let index = getElementIndex(`Hab-${roomNumber}`, towelsXRoom);
        if(index == -1){
            towelsXRoom.data.labels.push(`Hab-${roomNumber}`);
            towelsXRoom.data.datasets[0].data.push(object.towels);
        }
        else towelsXRoom.data.datasets[0].data[index] += object.towels;
    }
    towelsXRoom.update();
};

socket.on('towelsXRoom', function(data){
    let index = getElementIndex(`Hab-${data._id}`, towelsXRoom);
    console.log(index);
    if(index == -1){
        towelsXRoom.data.labels.push(`Hab-${data._id}`);
        towelsXRoom.data.datasets[0].data.push(data.towels);
    }
    else towelsXRoom.data.datasets[0].data[index] += data.towels;
    towelsXRoom.update();
});