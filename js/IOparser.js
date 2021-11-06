
var BLOCK_HEIGHT = 30
var BLOCK_WIDTH = 0.01

var LEFT_MARGIN = 100

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

document.getElementById("run").onclick = initialize
document.getElementById("resetLotColor").onclick = resetLotColor

var schedule;

var chamberHeight = {
    "AAAA01-1" : BLOCK_HEIGHT,
    "AAAA01-2" : BLOCK_HEIGHT * 2,
    "AAAA01-3" : BLOCK_HEIGHT * 3,
    "AAAA01-4" : BLOCK_HEIGHT * 4
}

function getRandomColor(){
    return '#' + Math.round(Math.random() * 0xffffff).toString(16)
}

var lotColor = {}

function resetLotColor(){
    Object.keys(lotColor).forEach(function(key) {
        lotColor[key] = getRandomColor()
    });
    draw(schedule)
}

function drawRect(x, y, width, height, color){
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height);
}

function draw(schedule) {
    ctx.clearRect(0, 0, 10000, 10000)

    var minTime = '99999999 999999'

    for(var i = 0 ; i < schedule.length ; i++){
        var startTime = schedule[i][3]

        if(minTime > startTime){
            minTime = startTime
        }
    }

    minTime = moment(minTime)

    for(var i = 0 ; i < schedule.length ; i++){
        var chamber = schedule[i][1]
        var lot = schedule[i][2]
        var startTime = schedule[i][3]
        startTime = moment(startTime).diff(minTime, 'seconds')
        var endTime = schedule[i][4]
        endTime = moment(endTime).diff(minTime, 'seconds')

        if(lotColor[lot] === undefined){
            lotColor[lot] = getRandomColor()
        }

        drawRect(LEFT_MARGIN + startTime * BLOCK_WIDTH, chamberHeight[chamber], (endTime - startTime + 1) * BLOCK_WIDTH, BLOCK_HEIGHT, lotColor[lot])
    }
}

function initialize() {
    schedule = JSON.parse(document.getElementById("jsonData").value)
    draw(schedule)
}
