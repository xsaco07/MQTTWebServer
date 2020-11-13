let CURRENT_DATE = new Date();
let CURRENT_FORMATTED_DATE = CURRENT_DATE.toISOString().slice(0, 10);

var towelsWeightXHourCanvas = document.getElementById('towelsWeightXHour').getContext('2d');

const towelsWeightXHour = new Chart(towelsWeightXHourCanvas, {
    type: 'line',
    data: {
        labels: ['00:00', '01:00', '02:00','03:00','04:00','05:00',
                '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
                '13:00','14:00','15:00','16:00','17:00','18:00','19:00',
                '20:00','21:00','22:00','23:00'
        ],
        datasets: [{
            label: 'Kgs de Toallas',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgb(39, 33, 146, 0.85)',
            borderWidth: 2,
            borderColor : 'rgb(39, 33, 146, 0.85)',
            hoverBackgroundColor : 'rgb(39, 33, 146, 0.6)',
            fill : false
        }]
    },
    options: {
        title: {
            display : true,
            padding : 20,
            fontSize : 24,
            fontStyle : "normal",
            text: `Kilos de toallas consumidas por hora (${CURRENT_FORMATTED_DATE})`,
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
                    padding : 20
                },
                gridLines : {
                    
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

const TowelsXHour = Object.freeze({
    chart : towelsWeightXDay,
    goBack : () => {
        CURRENT_DATE.setDate(CURRENT_DATE.getDate() - 1);
        CURRENT_FORMATTED_DATE = CURRENT_DATE.toISOString().slice(0, 10);
        const endPoint = `/api/towelConsumption/hour/${CURRENT_FORMATTED_DATE}/`;
        fetchAndLoadTowelsWeightXHour(endPoint);
        // Update chart title to show current date
        towelsWeightXHour.options.title.text = 
            `Kilos de toallas consumidas por hora (${CURRENT_FORMATTED_DATE})`;
        towelsWeightXHour.data.datasets[0].data = 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        towelsWeightXHour.update();
    },
    goForward : () => {
        
        // Set a tmp date to today midnight
        const tmpToday = new Date(TODAY);
        tmpToday.setHours(24, 0, 0, 0);

        // Try with tmp dates in case is not allowed
        const tmpDate = new Date(CURRENT_DATE);
        tmpDate.setDate(tmpDate.getDate() + 1);
        // Can not go beyond today
        if(tmpDate <= tmpToday){
            
            CURRENT_DATE.setDate(CURRENT_DATE.getDate() + 1);
            CURRENT_FORMATTED_DATE = CURRENT_DATE.toISOString().slice(0, 10);

            const endPoint = `/api/towelConsumption/hour/${CURRENT_FORMATTED_DATE}/`;
            fetchAndLoadTowelsWeightXHour(endPoint);
            // Update chart title to show current date
            towelsWeightXHour.options.title.text = 
                `Kilos de toallas consumidas por hora (${CURRENT_FORMATTED_DATE})`;
            towelsWeightXHour.data.datasets[0].data = 
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            towelsWeightXHour.update();
        }
    }
});

const loadTowelsWeightXHourChart = (serverData) => {
    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id+':00', towelsWeightXHour);
        towelsWeightXHour.data.datasets[0].data[index] = Math.round(object.weight / 1000);
    }
    towelsWeightXHour.update();
};

socket.on('towelsWeightXHour', function(object){
    let index = getElementIndex(object._id+':00', towelsWeightXHour);
    // If the label is being shown in this moment
    if(index != -1){
        towelsWeightXHour.data.datasets[0].data[index] += Math.round(object.weight / 1000);
        towelsWeightXHour.update();
    }
});