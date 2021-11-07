var BLOCK_HEIGHT = 30
var BLOCK_WIDTH = 0.01

var LEFT_MARGIN = 200

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

document.getElementById("run").onclick = initialize
document.getElementById("resetLotColor").onclick = resetLotColor

var schedule;

var eqpSet = {}
var chamberHeight = {}


function getRandomColor() {
    return '#' + Math.round(Math.random() * 0xffffff).toString(16)
}

var lotColor = {}


function resetLotColor() {
    Object.keys(lotColor).forEach(function (key) {
        lotColor[key] = getRandomColor()
    });
    draw(schedule)
}


function drawRect(x, y, width, height, color) {
    console.log(x, y, width, height)
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height     );
}


function draw(schedule) {
    ctx.clearRect(0, 0, 10000, 10000)

    var minTime = '99999999 999999'
    var eqpIdx = 0

    for (var i = 0; i < schedule.length; i++) {
        var eqp = schedule[i][0]
        var chamber = schedule[i][1]
        var lot = schedule[i][2]
        var startTime = schedule[i][3]

        if (minTime > startTime) {
            minTime = startTime
        }

        if (eqpSet[eqp] === undefined) {
            eqpSet[eqp] = eqpIdx
            eqpIdx = eqpIdx + 1
        }

        if (chamberHeight[chamber] === undefined){
            chamberHeight[chamber] = eqpSet[eqp] * 7 * BLOCK_HEIGHT + parseInt(chamber.split('-')[1]) * BLOCK_HEIGHT
        }

        if (lotColor[lot] === undefined) {
            lotColor[lot] = getRandomColor()
        }
    }

    minTime = moment(minTime)

    Object.keys(eqpSet).forEach(function (key) {
        drawRect(0, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT, LEFT_MARGIN - BLOCK_HEIGHT * 3, BLOCK_HEIGHT * 6, 'lightgrey')
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = 'bold ' + BLOCK_HEIGHT / 1.5 + 'px serif';
        ctx.fillText(key, (LEFT_MARGIN - BLOCK_HEIGHT * 3) / 2, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT * 4)

        for(var i = 1 ; i <= 6 ; i++){
            drawRect(LEFT_MARGIN - BLOCK_HEIGHT * 3, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT * i, BLOCK_HEIGHT, BLOCK_HEIGHT, 'darkgrey')
            ctx.fillStyle = 'black'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = 'bold ' + BLOCK_HEIGHT / 1.5 + 'px serif';
            ctx.fillText(i, LEFT_MARGIN - BLOCK_HEIGHT * 2.5, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT * (i + 0.5))
        }
    });

    for (var i = 0; i < schedule.length; i++) {
        var chamber = schedule[i][1]
        var lot = schedule[i][2]
        var startTime = schedule[i][3]
        startTime = moment(startTime).diff(minTime, 'seconds')
        var endTime = schedule[i][4]
        endTime = moment(endTime).diff(minTime, 'seconds')

        drawRect(LEFT_MARGIN + startTime * BLOCK_WIDTH, chamberHeight[chamber], (endTime - startTime + 1) * BLOCK_WIDTH, BLOCK_HEIGHT, lotColor[lot])
    }
}

function initialize() {
    schedule = JSON.parse(document.getElementById("jsonData").value)
    eqpSet = {}
    chamberHeight = {}
    lotColor = {}
    draw(schedule)
}
