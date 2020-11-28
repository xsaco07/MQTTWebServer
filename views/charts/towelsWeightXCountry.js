
const towelsWeightXCountryCanvas = document.getElementById('towelsWeightXCountry').getContext('2d');
const towelsWeightXCountry = new Chart(towelsWeightXCountryCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Kgs de Toallas',
            data: [],
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
            text: "Kilos de toallas consumidas por nacionalidad"
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

const loadTowelsWeightXCountryChart = (serverData) => {
    for (total of Object.values(serverData)){
        const guestCountry = total.checkIn_id.guest_id.country;
        let index = getElementIndex(guestCountry, towelsWeightXCountry);
        if(index == -1){
            towelsWeightXCountry.data.labels.push(guestCountry);
            towelsWeightXCountry.data.datasets[0].data.push(total.totals.towels.weight / 1000);
        }
        else towelsWeightXCountry.data.datasets[0].data[index] += (total.totals.towels.weight / 1000);
    }
    towelsWeightXCountry.update();
};

socket.on('towelsXCountry', function(data){
    let index = getElementIndex(data.country, towelsWeightXCountry);
    if(index == -1){
        towelsWeightXCountry.data.labels.push(data.country);
        towelsWeightXCountry.data.datasets[0].data.push(data.weight / 1000);
        index = towelsWeightXCountry.data.datasets[0].data.length - 1;
    }
    else towelsWeightXCountry.data.datasets[0].data[index] += (data.weight / 1000);
    towelsWeightXCountry.update();
});