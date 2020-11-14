const towelsWeightXDayCanvas = document.getElementById('towelsWeightXDay').getContext('2d');
const towelsWeightXDay = new Chart(towelsWeightXDayCanvas, {
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

const loadTowelsWeightXDayChart = (serverData, lastDayConsidered) => {

    // First time loading the chart
    if(towelsWeightXDay.data.labels.length == 0){
        towelsWeightXDay.data.labels = getLastXDays(CONS_LAST_DAYS);
    }
    // Is already loaded - get a new set of labels
    else {
        // Reset data to update new values
        towelsWeightXDay.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
        towelsWeightXDay.data.labels = getLastXDaysSince(CONS_LAST_DAYS, lastDayConsidered);
    }
    
    serverData.sort(custom_sort);

    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id, towelsWeightXDay);
        towelsWeightXDay.data.datasets[0].data[index] = Math.round(object.weight / 1000);
    }
    
    towelsWeightXDay.update();
};

const TowelsXDay = Object.freeze({
    chart : towelsWeightXDay,
    goXDaysBack : () => {
        const lastDay = towelsWeightXDay.data.labels[0];
        const endPoint = `api/towelConsumption/day/${lastDay}/${CONS_LAST_DAYS}`;
        fetchAndLoadTowelsWeightXDay(endPoint, lastDay);
    },
    goXDaysForward : () => {

        const labels = towelsWeightXDay.data.labels;
        let lastLabelDate = labels[labels.length - 1];
        const todayFormatted = new Date().toISOString().slice(0, 10);

        if(lastLabelDate != todayFormatted) {

            const lastDate = new Date(lastLabelDate);
            lastDate.setDate(lastDate.getDate() + (CONS_LAST_DAYS - 1)); // -1 to consider today as well
            let lastDateFormatted = lastDate.toISOString().slice(0, 10);

            const endPoint = `api/towelConsumption/day/${lastDateFormatted}/${CONS_LAST_DAYS}`;
            fetchAndLoadTowelsWeightXDay(endPoint, lastDateFormatted);

        }
    }
});

socket.on('towelsXDay', function(object){
    let index = getElementIndex(object._id, towelsWeightXDay);
    // If the label is being shown in this moment
    if(index != -1){
        towelsWeightXDay.data.datasets[0].data[index] += Math.round(object.weight / 1000);
        towelsWeightXDay.update();
    }
});