var towelsXRoomCanvas = document.getElementById('towelsXRoom').getContext('2d');

var towelsXRoom = new Chart(towelsXRoomCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '# de Toallas',
            data: [],
            // Custom field to show each room capacity for each tooltip
            capacity : [],
            backgroundColor: 'rgb(39, 33, 146, 0.85)',
            borderWidth: 1,
            borderColor : 'rgb(0,0,0)',
            hoverBackgroundColor : 'rgb(39, 33, 146, 0.6)'
        }]
    },
    options: {

        tooltips : {
            callbacks : {
                title: function(tooltipItems, data) {
                    return tooltipItems[0].xLabel + ' Capacidad: ' + 
                    data.datasets[0].capacity[tooltipItems[0].index] + ' pers';
                }
            }
        },

        title: {
            display : true,
            padding : 20,
            fontSize : 24,
            fontStyle : "normal",
            text: "Consumo de toallas por habitación activa"
        },
        legend: {
            display: true,
            labels: {
                fontSize : 18
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontSize : 15,
                    padding : 20,
                }
            }],
            xAxes: [{
                ticks: {
                    fontSize : 15,
                },
                gridLines : {
                    display : false
                }
            }]
        }
    }
});

const loadTowelsXRoomChart = (serverData) => {
    // Fill data, capacity, and labels array
    for (_id of Object.keys(serverData)){
        const object = serverData[_id];
        const roomNumber = parseInt(_id);
        let index = getElementIndex(`Hab-${roomNumber}`, towelsXRoom);
        if(index == -1){
            towelsXRoom.data.labels.push(`Hab-${roomNumber}`);
            towelsXRoom.data.datasets[0].data.push(object.towels);
            towelsXRoom.data.datasets[0].capacity.push(object.capacity);
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