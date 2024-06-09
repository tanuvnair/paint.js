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

        // Set currentToolIndex to the index of the clicked tool item
        currentToolIndex = Array.prototype.indexOf.call(toolItems, this);

        switch (currentToolIndex) {
            case 0:
                console.log("Selection tool");
                break;
            case 1:
                console.log("Pencil tool");
                pencilTool();
                break;
            case 2:
                console.log("Square tool");
                squareTool();
                break;
            default:
                console.log("Something went wrong");
                break;
        }
    });
}

// Canvas stuff
const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;

function pencilTool() {
    var isDrawing = false;
    var lastX = 0;
    var lastY = 0;

    myCanvas.addEventListener("mousedown", function (e) {
        if (currentToolIndex == 1) {
            lastX = e.offsetX;
            lastY = e.offsetY;
            isDrawing = true;
        }
    });

    myCanvas.addEventListener("mousemove", function (e) {
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
    });

    myCanvas.addEventListener("mouseup", function () {
        if (currentToolIndex == 1) {
            isDrawing = false;
        }
    });
}

function squareTool() {
    myCanvas.addEventListener("mousedown", function (e) {

    })
}

// Clear Canvas
const clearCanvasButton = document.getElementById("clearCanvasButton");
clearCanvasButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
});

// Save As Image
const saveAsImageButton = document.getElementById("saveAsImageButton");
saveAsImageButton.addEventListener("click", function () {
    // The variable canvasUrl stores a data URL representing the image content of the canvas.
    var canvasUrl = myCanvas.toDataURL();

    const dummyAnchorElement = document.createElement('a');
    dummyAnchorElement.href = canvasUrl;

    dummyAnchorElement.download = "image";

    dummyAnchorElement.click();
    dummyAnchorElement.remove();
});