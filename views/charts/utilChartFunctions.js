function randomData(chart){
    console.log("pressed");
    let random = [];
    for (let index = 0; index < 5; index++) {
        random.push(Math.floor(Math.random() * 100));
    }
    chart.data.datasets[0].data = random
    chart.update()
}

function increase(chart){
    let newData = []
    chart.data.datasets[0].data.forEach((val) => {
        if(val % 2 == 0) newData.push(val += 2)
        else newData.push(val)
    });
    chart.data.datasets[0].data = newData
    chart.update();
}