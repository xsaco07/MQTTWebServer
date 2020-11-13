const waterXDayCanvas = document.getElementById('waterXDay').getContext('2d');
const waterXDay = new Chart(waterXDayCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Litros de agua',
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
            text: "Consumo de agua por día (últimos 7 días)"
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

const WaterXDay = Object.freeze({
    chart : waterXDay,
    goXDaysBack : () => {
        const lastDay = waterXDay.data.labels[0];
        const endPoint = `api/waterConsumption/day/${lastDay}/${CONS_LAST_DAYS}`;
        fetchAndLoadWaterXDay(endPoint, lastDay);
    },
    goXDaysForward : () => {

        const labels = waterXDay.data.labels;
        let lastLabelDate = labels[labels.length - 1];
        const todayFormatted = new Date().toISOString().slice(0, 10);

        if(lastLabelDate != todayFormatted) {

            const lastDate = new Date(lastLabelDate);
            lastDate.setDate(lastDate.getDate() + (CONS_LAST_DAYS - 1)); // -1 to consider today as well
            let lastDateFormatted = lastDate.toISOString().slice(0, 10);

            const endPoint = `api/waterConsumption/day/${lastDateFormatted}/${CONS_LAST_DAYS}`;
            fetchAndLoadWaterXDay(endPoint, lastDateFormatted);

        }
    }
});

const loadWaterXDayChart = (serverData, lastDayConsidered) => {
    
    // First time loading the chart
    if(waterXDay.data.labels.length == 0){
        waterXDay.data.labels = getLastXDays(CONS_LAST_DAYS);
    }
    // Is already loaded - get a new set of labels
    else {
        // Reset data to update new values
        waterXDay.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
        waterXDay.data.labels = getLastXDaysSince(CONS_LAST_DAYS, lastDayConsidered);
    }

    serverData.sort(custom_sort);

    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id, waterXDay);
        waterXDay.data.datasets[0].data[index] += object.consumption;
    }
    waterXDay.update();
};

socket.on('waterXDay', function(object){
    let index = getElementIndex(object._id, waterXDay);
    // If the label is being shown in this moment
    if(index != -1){
        waterXDay.data.datasets[0].data[index] += object.consumption;
        waterXDay.update();
    }
});