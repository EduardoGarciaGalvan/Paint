//Variables
const arrows = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
const buttons = { PRINCIPAL: 0, SCROLL: 1, SECUNDARY: 2, EXTRA1: 3 , EXTRA2: 4};
const colorValue = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
const map = new Map();
var canvasColor = document.getElementById("canvasColor");
var penColor = document.getElementById("penColor");
var edges = document.getElementById("drawEdges");
var remove = document.getElementById("removeLines");
var reset = document.getElementById("resetPaint");
var zone = document.getElementById("theZone");
var cColor = "#ffffff";
var pColor = "#000000";
var eColor = "#000000";
var xMovement = 1;
var yMovement = 1;
var thickness = 2;
var isActived = false;
var mouseIsDown = false;

//Constructor
zone.width = 1080;
zone.height = 720;
var zContext = zone.getContext("2d");
var wCanvas = zone.width;
var x = wCanvas/2;
var xTemp = x;
var hCanvas = zone.height;
var y = hCanvas/2;
var yTemp = y;
drawInCanvas(penColor.value, x - .5, y - .5, x + .5, y + .5, zContext);
canvasColor.value = cColor;
penColor.value = pColor;
drawPointCenter(zContext);
edges.checked = true;
drawEdges();

//Events
edges.addEventListener("click", drawEdges);
canvasColor.addEventListener("input", drawCanvas);
document.addEventListener("keydown", arrowDetector);
document.addEventListener("keyup", arrowDetector);
zone.addEventListener("mousedown" , downMouse);
zone.addEventListener("mousemove" , mouseMovement);
window.addEventListener("mouseup" , upMouse);
remove.addEventListener("click", removeLines);
reset.addEventListener("click", resetCanvas);
setInterval(drawArrows, 10);
 

//Functions
function downMouse(mouse)
{
    if(isActived) isActived = !isActived;
    mouseIsDown = true;
    x = mouse.offsetX;
    y = mouse.offsetY;
}

function upMouse(mouse)
{
    if (x == mouse.offsetX && y == mouse.offsetY)
    {
        drawInCanvas(penColor.value, x - .5, y - .5, x + .5, y + .5, zContext);
    }
    mouseIsDown = false;
}

function mouseMovement(mouse)
{
    if (mouseIsDown)
    {
        //position in X
        if(mouse.offsetX < thickness) xTemp = thickness;
        else if(mouse.offsetX > wCanvas - thickness) xTemp = wCanvas - thickness;
        else xTemp = mouse.offsetX;
        //position in Y
        if(mouse.offsetY < thickness) yTemp = thickness;
        else if(mouse.offsetY > hCanvas - thickness) yTemp = hCanvas - thickness;
        else yTemp = mouse.offsetY;
        drawInCanvas(penColor.value, x, y, xTemp, yTemp, zContext);
        x = xTemp;
        y = yTemp;
    }
}

function drawArrows()
{
    map.forEach(element =>{
        if(element) isActived = true;
    });
    if(!isActived) return;
    xTemp = x;
    yTemp = y;
    map.forEach(function(element, key) {
        if(key == arrows.LEFT && element == true)
        {
            xTemp = (x-xMovement > thickness)? x - xMovement : thickness;
        }
        else if(key == arrows.RIGHT && element == true)
        {
            xTemp = (x + xMovement < wCanvas - thickness)? x + xMovement : wCanvas - thickness;
        }
        if(key == arrows.UP && element == true)
        {
            yTemp = (y - yMovement > thickness)? y - yMovement : thickness;
        }
        else if(key == arrows.DOWN && element == true)
        {
            yTemp = (y + yMovement < hCanvas - thickness)? y + yMovement : hCanvas - thickness;
        }
    });
    drawInCanvas(penColor.value, x, y, xTemp, yTemp, zContext);
    x = xTemp;
    y = yTemp;
    isActived = false;
}

function arrowDetector(arrow)
{
    if(arrow.keyCode == arrows.LEFT || arrow.keyCode == arrows.UP || arrow.keyCode == arrows.RIGHT || arrow.keyCode == arrows.DOWN)
    {
        map.set(arrow.keyCode, arrow.type == "keydown");
    }
}

function resetCanvas()
{
    canvasColor.value = cColor;
    penColor.value = pColor;
    edges.checked = true;
    drawCanvas();
    removeLines();
}

function drawCanvas()
{
    oppositeColorGenerator();
    zone.style.backgroundColor = canvasColor.value;
}

function oppositeColorGenerator()
{
    var cTemp = "#";
    for(var valueColor in canvasColor.value)
    {
        for(var valueOpposite in colorValue)
        {
            if (canvasColor.value[valueColor].toLowerCase() == colorValue[valueOpposite])
            {
                cTemp += colorValue[colorValue.length - 1 - parseInt(valueOpposite)];
            }
        }
    }
    eColor = cTemp;
    drawEdges()
}

function removeLines()
{
    zContext.clearRect( 0, 0, wCanvas, hCanvas);
    drawEdges();
    drawPointCenter(zContext);
}

function drawEdges()
{
    if(edges.checked)
    {
        zContext.beginPath();
        zContext.strokeStyle = eColor;
        zContext.lineWidth = thickness;
        zContext.strokeRect(0, 0, wCanvas, hCanvas);
        zContext.closePath();
    }
    else
    {
        zContext.beginPath();
        zContext.strokeStyle = cColor;
        zContext.lineWidth = thickness;
        zContext.strokeRect(0, 0, wCanvas, hCanvas);
        zContext.closePath();
    }
}

function drawPointCenter(canvas)
{
    x = wCanvas/2;
    y = hCanvas/2;
    canvas.beginPath();
    canvas.strokeStyle = penColor.value;
    canvas.lineWidth = thickness;
    canvas.arc(x, y, 1, 0, 2*Math.PI);
    canvas.stroke();
    canvas.closePath();
}

function drawInCanvas(color,xInitial, yInitial, xFinal, yFinal, canvas)
{
    canvas.beginPath();
    canvas.strokeStyle = color;
    canvas.lineWidth = thickness;
    canvas.lineCap = "round";
    canvas.moveTo(xInitial,yInitial);
    canvas.lineTo(xFinal,yFinal);
    canvas.stroke();
    canvas.closePath();
}