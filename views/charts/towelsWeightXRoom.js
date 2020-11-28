var towelsWeightXRoomCanvas = document.getElementById('towelsWeightXRoom').getContext('2d');

var towelsWeightXRoom = new Chart(towelsWeightXRoomCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Kgs de Toallas',
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
            text: "Kilos de toallas consumidos por habitación (activas)"
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

const loadTowelsWeightXRoomChart = (serverData) => {
    // Fill data, capacity, and labels array
    for (total of Object.values(serverData)){
        const roomNumber = total.checkIn_id.room_id.roomNumber;
        let index = getElementIndex(`Hab-${roomNumber}`, towelsWeightXRoom);
        if(index == -1){
            towelsWeightXRoom.data.labels.push(`Hab-${roomNumber}`);
            towelsWeightXRoom.data.datasets[0].data.push(total.totals.towels.weight / 1000);
            towelsWeightXRoom.data.datasets[0].capacity.push(total.checkIn_id.room_id.capacity);
        }
        else towelsWeightXRoom.data.datasets[0].data[index] += (total.totals.towels.weightweight / 1000);
    }
    towelsWeightXRoom.update();
};

socket.on('towelsXRoom', function(data){
    let index = getElementIndex(`Hab-${data._id}`, towelsWeightXRoom);
    console.log(index);
    if(index == -1){
        towelsWeightXRoom.data.labels.push(`Hab-${data._id}`);
        towelsWeightXRoom.data.datasets[0].data.push(data.weight / 1000);
    }
    else towelsWeightXRoom.data.datasets[0].data[index] += data.weight / 1000;
    towelsWeightXRoom.update();
});