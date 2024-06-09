// Colors
var style = getComputedStyle(document.body);
const text = style.getPropertyValue("--text");
const background = style.getPropertyValue("--background");
const primary = style.getPropertyValue("--primary");
const secondary = style.getPropertyValue("--secondary");
const accent = style.getPropertyValue("--accent");

// Change toolbar active element
var toolBar = document.getElementById("toolBar");
var toolItems = document.getElementsByClassName("tool-item");
var currentToolIndex = 0;

for (var i = 0; i < toolItems.length; i++) {
    toolItems[i].addEventListener("click", function () {
        for (var j = 0; j < toolItems.length; j++) {
            toolItems[j].classList.remove("active");
        }
        this.classList.add("active");

        // // Set currentToolIndex to the index of the clicked tool item
        // currentToolIndex = Array.prototype.indexOf.call(toolItems, this);

        // switch (currentToolIndex) {
        //     case 0:
        //         selectionTool();
        //         break;
        //     case 1:
        //         pencilTool();
        //         break;
        //     case 2:
        //         rectangleTool();
        //         break;
        //     case 3:
        //         circleTool();
        //         break;
        //     default:
        //         console.log("Something went wrong");
        //         break;
        // }
    });
}

toolItems[0].addEventListener("click", function () {
    currentToolIndex = 0;
});

toolItems[1].addEventListener("click", function () {
    currentToolIndex = 1;
});

toolItems[2].addEventListener("click", function () {
    currentToolIndex = 2;
});

toolItems[3].addEventListener("click", function () {
    currentToolIndex = 3;
});

// Canvas stuff
const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;

window.addEventListener("resize", updateSize);

function updateSize() {
    var savedImageData = ctx.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
    );

    myCanvas.height = window.innerHeight;
    myCanvas.width = window.innerWidth;

    ctx.putImageData(savedImageData, 0, 0);
}

// Shapes storages?
var rectangles = [];
var circles = [];
var selectedShape = null;

var isDrawing = false;
var mouseX = 0,
    mouseY = 0;

var lastX = 0,
    lastY = 0;
var x, y, w, h;
var r;
var savedImageData;

myCanvas.addEventListener("mousedown", function (e) {
    switch (currentToolIndex) {
        case 0:
            mouseX = e.clientX - myCanvas.getBoundingClientRect().left;
            mouseY = e.clientY - myCanvas.getBoundingClientRect().top;

            for (var i = 0; i < rectangles.length; i++) {
                if (isPointInRectangle(mouseX, mouseY, rectangles[i])) {
                    selectedShape = rectangles[i];
                    break;
                }
            }
            break;
        case 1:
            lastX = e.offsetX;
            lastY = e.offsetY;
            isDrawing = true;
            break;
        case 2:
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;

            // Save the current canvas state
            savedImageData = ctx.getImageData(
                0,
                0,
                myCanvas.width,
                myCanvas.height
            );
            break;
        case 3:
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;

            // Save the current canvas state
            savedImageData = ctx.getImageData(
                0,
                0,
                myCanvas.width,
                myCanvas.height
            );
            break;
    }
});

myCanvas.addEventListener("mousemove", function (e) {
    switch (currentToolIndex) {
        case 0:
            if (selectedShape) {
                mouseX = e.clientX - myCanvas.getBoundingClientRect().left;
                mouseY = e.clientY - myCanvas.getBoundingClientRect().top;

                selectedShape.x = mouseX - selectedShape.w / 2;
                selectedShape.y = mouseY - selectedShape.h / 2;

                redrawCanvas();
            }
            break;
        case 1:
            if (currentToolIndex == 1 && isDrawing) {
                ctx.beginPath();
                ctx.strokeStyle = primary;
                ctx.lineWidth = 5;
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                lastX = e.offsetX;
                lastY = e.offsetY;
            }
            break;
        case 2:
            if (isDrawing) {
                w = e.offsetX - x;
                h = e.offsetY - y;

                // Restore the saved canvas state
                ctx.putImageData(savedImageData, 0, 0);

                drawRect(x, y, w, h, primary, false);
            }
            break;
        case 3:
            if (isDrawing) {
                r = Math.sqrt(
                    Math.pow(e.offsetX - x, 2) + Math.pow(e.offsetY - y, 2)
                );

                // Restore the saved canvas state
                ctx.putImageData(savedImageData, 0, 0);

                drawCircle(x, y, r, primary, false);
            }
            break;
    }
});

myCanvas.addEventListener("mouseup", function (e) {
    switch (currentToolIndex) {
        case 0:
            selectedShape = null;
        case 1:
            isDrawing = false;
            break;
        case 2:
            drawRect(x, y, w, h, primary);
            isDrawing = false;
            rectangles.push({ x: x, y: y, w: w, h: h });
            console.log(rectangles);
            break;
        case 3:
            drawCircle(x, y, r, primary);
            isDrawing = false;
            break;
    }
});

// Helper Functions
function isPointInRectangle(x, y, rect) {
    return (
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h
    );
}

function redrawCanvas() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    rectangles.forEach((rect) => {
        drawRect(rect.x, rect.y, rect.w, rect.h, primary);
    });
}

function drawRect(x, y, w, h, color, fill = true) {
    ctx.beginPath();

    if (fill == true) {
        ctx.fillStyle = `${color}`;
        ctx.fillRect(x, y, w, h);
    } else {
        ctx.strokeStyle = `${color}`;
        ctx.strokeRect(x, y, w, h);
    }
}

function drawCircle(x, y, radius, color, fill = true) {
    ctx.beginPath();

    if (fill == true) {
        ctx.fillStyle = `${color}`;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    } else {
        ctx.strokeStyle = `${color}`;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

// Clear Canvas
const clearCanvasButton = document.getElementById("clearCanvasButton");
clearCanvasButton.addEventListener("click", function (e) {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    rectangles.length = 0;
    circles.length = 0;
});

// Save As Image
const saveAsImageButton = document.getElementById("saveAsImageButton");
saveAsImageButton.addEventListener("click", function (e) {
    // The variable canvasUrl stores a data URL representing the image content of the canvas.
    var canvasUrl = myCanvas.toDataURL();

    const dummyAnchorElement = document.createElement("a");
    dummyAnchorElement.href = canvasUrl;

    dummyAnchorElement.download = "image";

    dummyAnchorElement.click();
    dummyAnchorElement.remove();
});