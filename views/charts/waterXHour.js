var waterXHourCanvas = document.getElementById('waterXHour').getContext('2d');

const waterXHour = new Chart(waterXHourCanvas, {
    type: 'line',
    data: {
        labels: ['00:00', '01:00', '02:00','03:00','04:00','05:00',
                '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
                '13:00','14:00','15:00','16:00','17:00','18:00','19:00',
                '20:00','21:00','22:00','23:00'
        ],
        datasets: [{
            label: 'Litros de agua',
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
            text: `Consumo de agua por hora (${TODAY_FORMATTED})`,
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

class WaterXHour {

    static getNewDate() {
        const newDate = new Date();
        newDate.setHours(newDate.getHours() - new Date().getTimezoneOffset()/60);
        return newDate;
    }

    static CURRENT_DATE = this.getNewDate();
    static CURRENT_FORMATTED_DATE = this.CURRENT_DATE.toISOString().slice(0, 10);
    static chart = waterXHour;

    static goBack() {

        // Reduce 1 day
        this.CURRENT_DATE.setDate(this.CURRENT_DATE.getDate() - 1);
        // Get yyyy-mm-dd format
        this.CURRENT_FORMATTED_DATE = this.CURRENT_DATE.toISOString().slice(0, 10);

        // Update chart title to show current date
        waterXHour.options.title.text = 
            `Consumo de agua por hora (${this.CURRENT_FORMATTED_DATE})`;
        waterXHour.data.datasets[0].data = 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        waterXHour.update();
        
        const endPoint = `/api/waterConsumption/hour/${this.CURRENT_FORMATTED_DATE}/`;
        fetchAndLoadWaterXHour(endPoint);

    }
    static goForward() {
        
        // Save tmp date to midnight
        const tmpToday = new Date(TODAY);
        tmpToday.setHours(24, 0, 0, 0);

        const tmpDate = new Date(this.CURRENT_DATE);
        // Add 1 day
        tmpDate.setDate(tmpDate.getDate() + 1);

        // Can not go beyond today
        if(tmpDate < tmpToday){

            this.CURRENT_DATE.setDate(this.CURRENT_DATE.getDate() + 1);
            this.CURRENT_FORMATTED_DATE = this.CURRENT_DATE.toISOString().slice(0, 10);

            // Update chart title to show current date
            waterXHour.options.title.text = 
                `Consumo de agua por hora (${this.CURRENT_FORMATTED_DATE})`;
            // Reset values in case the server answer is empty
            waterXHour.data.datasets[0].data = 
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            waterXHour.update();

            const endPoint = `/api/waterConsumption/hour/${this.CURRENT_FORMATTED_DATE}/`;
            fetchAndLoadWaterXHour(endPoint);

        }
    }
};

const loadWaterXHourChart = (serverData) => {
    for (object of Object.values(serverData)){
        let index = getElementIndex(object._id+':00', waterXHour);
        waterXHour.data.datasets[0].data[index] += Math.round(object.consumption);
    }
    waterXHour.update();
};

socket.on('waterXHour', function(object){
    let index = getElementIndex(object._id+':00', waterXHour);
    if(WaterXHour.CURRENT_DATE >= TODAY){
        // If the label is being shown in this moment
        if(index != -1){
            waterXHour.data.datasets[0].data[index] += Math.round(object.consumption);
            waterXHour.update();    
        }
    }
});