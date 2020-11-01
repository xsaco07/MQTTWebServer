let towelsXDay = null;

const loadTowelsXDayChart = (serverData) => {
    const canvasContext = document.getElementById('towelsXDay').getContext('2d');
    var towelsXDay = new Chart(canvasContext, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '# de Toallas',
                data: [],
                backgroundColor: 'rgb(1,34,65,0.5)',
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: "Consumo de toallas por día"
            }
        }
    });

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
    else towelsXCountry.data.datasets[0].data[index] += object.towels;
    towelsXCountry.update();
});