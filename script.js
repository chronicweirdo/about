var red = {r: 255, g: 0, b: 0}
var green = {r: 0, g: 255, b: 0}
var colors = []
var REFRESH_RATE = 80
var COLOR_TRANSITION_STEPS = 50

var palettes = [
    //["#8f00f2", "#00cffb", "#5cff00", "#fdfb00", "#fdae32", "#ff0c12"], // neon rainbow 2
    //["00feca", "fdf200", "ff85ea", "7b61f8"], // neon 2
    //["01ffc3", "01ffff", "ffb3fd", "9d72ff"], // neon 4
    //["a0edff", "ebf875", "28cf75", "fe6b35"], // neon 5
    //["d9eb4b", "00a9fe", "fd6bb6", "ef0888"], // neon 6
    ["fef900", "03dddc", "ff822e", "f21a1d"] // neon 7
    //["fcf340", "7fff00", "fb33db", "0310ea"] // neon 8
]

function getRGB(hexCode) {
    let h = hexCode.trim()
    if (h.startsWith("#")) {
        h = h.substring(1)
    }
    let components = h.match(/.{1,2}/g)
    let rgb = {
        r: parseInt(components[0], 16),
        g: parseInt(components[1], 16),
        b: parseInt(components[2], 16)
    }
    return rgb
}

function getRGBList(hexList) {
    let result = []
    for (let i = 0; i < hexList.length; i++) {
        result.push(getRGB(hexList[i]))
    }
    return result
}

function getIntermediaryColors(c1, c2, steps) {
    let rStep = (c2.r - c1.r) / steps
    let gStep = (c2.g - c1.g) / steps
    let bStep = (c2.b - c1.b) / steps
    let result = []
    result.push(c1)
    for (let i = 1; i < steps; i++) {
        let current = {
            r: c1.r + i * rStep,
            g: c1.g + i * gStep,
            b: c1.b + i * bStep
        }
        result.push(current)
    }
    result.push(c2)
    return result
}

function pickBasedOnTimestamp(arr) {
    let index = Math.floor(+ new Date() / REFRESH_RATE) % arr.length
    return arr[index]
}

function cycle() {
    setTimeout(function() {
        let currentColor = pickBasedOnTimestamp(colors)
        let cssColor = "rgb(" + currentColor.r + "," + currentColor.g + "," + currentColor.b + ")"
        let path = document.getElementById("path")
        path.style.stroke = cssColor
        cycle()
    }, REFRESH_RATE)
}

function getCycleColors(colors, stepsBetweenColors) {
    let result = []
    for (let i = 0; i < colors.length-1; i++) {
        result = result.concat(getIntermediaryColors(colors[i], colors[i+1], stepsBetweenColors))
    }
    result = result.concat(getIntermediaryColors(colors[colors.length-1], colors[0], stepsBetweenColors))
    return result
}

window.onload = function() {
    colors = getCycleColors(getRGBList(pickBasedOnTimestamp(palettes)), COLOR_TRANSITION_STEPS)
    cycle()
}