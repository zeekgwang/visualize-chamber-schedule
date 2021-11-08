var BLOCK_HEIGHT = 30
var BLOCK_WIDTH = 0.01

var LEFT_MARGIN = 200

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

document.getElementById("run").onclick = initialize
document.getElementById("resetLotColor").onclick = resetLotColor
document.getElementById("resetPPIDColor").onclick = resetPPIDColor
document.getElementById("resetSchedPriColor").onclick = resetSchedPriColor


var schedule;

var eqpSet = {}
var chamberHeight = {}

var colorType = 'LOT'
var schedPriColor = {
    '0run': 'red',
    '0wait': 'orange',
    '1run': 'yellow',
    '1wait': 'green',
    '2run': 'blue',
    '2wait': 'darkblue',
    '3run': 'purple'
}
var ppidColor = {}
var lotColor = {}


function getRandomColor() {
    return '#' + Math.round(Math.random() * 0xffffff).toString(16)
}


function resetLotColor() {
    Object.keys(lotColor).forEach(function (key) {
        lotColor[key] = getRandomColor()
    });
    colorType = 'LOT'
    draw(schedule)
}

function resetPPIDColor() {
    Object.keys(ppidColor).forEach(function (key) {
        ppidColor[key] = getRandomColor()
    });
    colorType = 'PPID'
    draw(schedule)
}

function resetSchedPriColor() {
    colorType = 'SCHEDPRI'
    draw(schedule)
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
}

function drawEqp(eqpSet) {
    Object.keys(eqpSet).forEach(function (key) {
        drawRect(0, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT, LEFT_MARGIN - BLOCK_HEIGHT * 3, BLOCK_HEIGHT * 6, 'lightgrey')
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = 'bold ' + BLOCK_HEIGHT / 1.5 + 'px serif';
        ctx.fillText(key, (LEFT_MARGIN - BLOCK_HEIGHT * 3) / 2, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT * 4)

        for (var i = 1; i <= 6; i++) {
            drawRect(LEFT_MARGIN - BLOCK_HEIGHT * 3, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT * i, BLOCK_HEIGHT, BLOCK_HEIGHT, 'darkgrey')
            ctx.fillStyle = 'black'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = 'bold ' + BLOCK_HEIGHT / 1.5 + 'px serif';
            ctx.fillText(i, LEFT_MARGIN - BLOCK_HEIGHT * 2.5, eqpSet[key] * 7 * BLOCK_HEIGHT + BLOCK_HEIGHT * (i + 0.5))
        }
    });
}


function draw(schedule) {
    ctx.clearRect(0, 0, 10000, 10000)

    var minTime = '99999999 999999'
    var eqpIdx = 0

    for (var i = 0; i < schedule.length; i++) {
        var eqp = schedule[i][0]
        var chamber = schedule[i][1]
        var lot = schedule[i][2]
        var ppid = schedule[i][3]
        var startTime = schedule[i][5]

        if (minTime > startTime) {
            minTime = startTime
        }

        if (eqpSet[eqp] === undefined) {
            eqpSet[eqp] = eqpIdx
            eqpIdx = eqpIdx + 1
        }

        if (chamberHeight[chamber] === undefined) {
            chamberHeight[chamber] = eqpSet[eqp] * 7 * BLOCK_HEIGHT + parseInt(chamber.split('-')[1]) * BLOCK_HEIGHT
        }

        if (lotColor[lot] === undefined) {
            lotColor[lot] = getRandomColor()
        }

        if (ppidColor[ppid] === undefined) {
            ppidColor[ppid] = getRandomColor()
        }
    }

    minTime = moment(minTime)

    drawEqp(eqpSet)

    for (var i = 0; i < schedule.length; i++) {
        var chamber = schedule[i][1]
        var lot = schedule[i][2]
        var ppid = schedule[i][3]
        var schedPri = schedule[i][4]
        var startTime = schedule[i][5]
        startTime = moment(startTime).diff(minTime, 'seconds')
        var endTime = schedule[i][6]
        endTime = moment(endTime).diff(minTime, 'seconds')

        var color = lotColor[lot]
        if (colorType === 'LOT') {
            color = lotColor[lot]
        } else if (colorType === 'PPID') {
            color = ppidColor[ppid]
        } else if (colorType === 'SCHEDPRI') {
            color = schedPriColor[schedPri]
        }

        drawRect(LEFT_MARGIN + startTime * BLOCK_WIDTH, chamberHeight[chamber], (endTime - startTime + 1) * BLOCK_WIDTH, BLOCK_HEIGHT, color)
    }
}

function initialize() {
    schedule = JSON.parse(document.getElementById("jsonData").value)
    eqpSet = {}
    chamberHeight = {}
    lotColor = {}
    draw(schedule)
}
