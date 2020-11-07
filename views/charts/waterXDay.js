const waterXDayCanvas = document.getElementById('waterXDay').getContext('2d');
const waterXDay = new Chart(waterXDayCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Litros de agua',
            data: [0, 0, 0, 0, 0, 0, 0],
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
            text: "Consumo de agua por día (últimos 7 días)"
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

const loadWaterXDayChart = (serverData) => {
    waterXDay.data.labels = getLastXDays(lastDays);
    serverData.sort(custom_sort);
    console.log(serverData);
    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id, waterXDay);
        console.log(index);
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