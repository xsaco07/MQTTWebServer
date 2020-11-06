var towelsXRoomCanvas = document.getElementById('towelsXRoom').getContext('2d');

var towelsXRoom = new Chart(towelsXRoomCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '# de Toallas',
            data: [],
            backgroundColor: 'rgb(171,202,183)',
            borderWidth: 2,
            borderColor : 'rgb(1,34,65)',
            hoverBackgroundColor : 'rgb(1,34,65)'
        }]
    },
    options: {
        title: {
            display : true,
            padding : 20,
            fontSize : 24,
            fontStyle : "normal",
            fontColor : 'rgb(1,34,65)',
            text: "Consumo de toallas por habitación activa"
        },
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(1,34,65)',
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