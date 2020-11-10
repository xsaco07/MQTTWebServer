const towelsXDayCanvas = document.getElementById('towelsXDay').getContext('2d');
const towelsXDay = new Chart(towelsXDayCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Kgs de Toallas',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgb(39, 33, 146, 0.85)',
            borderWidth: 1,
            borderColor : 'rgb(0,0,0)',
            hoverBackgroundColor : 'rgb(39, 33, 146, 0.6)'
        }]
    },
    options: {
        title: {
            display : true,
            padding : 20,
            fontSize : 24,
            fontStyle : "normal",
            text: "Kilos de toallas consumidos por día (últimos 7 días)"
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

const loadTowelsXDayChart = (serverData) => {
    towelsXDay.data.labels = getLastXDays(lastDays);
    serverData.sort(custom_sort);
    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id, towelsXDay);
        if(index == -1){
            towelsXDay.data.labels.push(object._id);
            towelsXDay.data.datasets[0].data.push(object.towels);
        }
        else towelsXDay.data.datasets[0].data[index] += object.towels;
    }
    towelsXDay.update();
};

socket.on('towelsXDay', function(object){
    let index = getElementIndex(object._id, towelsXDay);
    if(index == -1){
        towelsXDay.data.labels.push(object._id);
        towelsXDay.data.datasets[0].data.push(object.towels);
    }
    else towelsXDay.data.datasets[0].data[index] += object.towels;
    towelsXDay.update();
});