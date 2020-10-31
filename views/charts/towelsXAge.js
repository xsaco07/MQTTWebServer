var socket = io();
let chart = null;
const endPoint = 'http://localhost:3000/towelConsumption/guest/';
const AGE_RANGES = 7;

window.addEventListener('load', function () {
    console.log('Window loaded');
    fetch(endPoint)
    .then(res => res.json())
    .then(data => chart = loadChart(data))
    .catch(error => console.log(error));
}, false);

const loadChart = (serverData) => {
    console.log('Loading chart...');
    const canvasContext = document.getElementById('towelsXAge').getContext('2d');
    var towelsXAge = new Chart(canvasContext, {
        type: 'bar',
        data: {
            labels: ['< 20','20 - 30','31 - 40','41 - 50','51 - 60','61 - 70', '> 70'],
            datasets: [{
                label: '# de Toallas',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgb(1,34,65,0.5)',
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: "Consumo de toallas por edad"
            }
        }
    });

    for (guestData of Object.values(serverData)){
        const index = getAgeIndex(guestData.guest.age);
        towelsXAge.data.datasets[0].data[index] += guestData.consumption;
    }

    towelsXAge.update();
    return towelsXAge;
};

const getAgeIndex = (age) => {
    index = 0;
    if(age < 20) index = 0;
    else if (age >= 20 && age <= 30) index = 1;
    else if(age >= 31 && age <= 40) index = 2;
    else if(age >= 41 && age <= 50) index = 3;
    else if(age >= 51 && age <= 60) index = 4;
    else if(age >= 61 && age <= 70) index = 5;
    else if(age > 70) index = 6;
    return index;
};

socket.on('towelsXAge', function(data){
    console.log(data);
    chart.data.datasets[0].data[data.index] += data.towels;
    chart.update();
});