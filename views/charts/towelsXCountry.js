
const towelsXCountryCanvas = document.getElementById('towelsXCountry').getContext('2d');
const towelsXCountry = new Chart(towelsXCountryCanvas, {
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
            text: "Consumo de toallas por nacionalidad"
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

const loadTowelsXCountryChart = (serverData) => {
    for (guestData of Object.values(serverData)){
        const guestCountry = guestData.guest.country;
        let index = getElementIndex(guestCountry, towelsXCountry);
        if(index == -1){
            towelsXCountry.data.labels.push(guestCountry);
            towelsXCountry.data.datasets[0].data.push(guestData.towels);
        }
        else towelsXCountry.data.datasets[0].data[index] += guestData.towels;
    }
    towelsXCountry.update();
};

socket.on('towelsXCountry', function(data){
    let index = getElementIndex(data.country, towelsXCountry);
    if(index == -1){
        towelsXCountry.data.labels.push(data.country);
        towelsXCountry.data.datasets[0].data.push(data.towels);
        index = towelsXCountry.data.datasets[0].data.length - 1;
    }
    else towelsXCountry.data.datasets[0].data[index] += data.towels;
    towelsXCountry.update();
});