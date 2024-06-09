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
                pencilTool();
                break;
            case 2:
                rectangleTool();
                break;
            case 3:
                circleTool();
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

    myCanvas.addEventListener("mouseup", function (e) {
        if (currentToolIndex == 1) {
            isDrawing = false;
        }
    });
}

function rectangleTool() {
    var x;
    var y;
    var w;
    var h;
    var isDrawing = false;
    var savedImageData;

    myCanvas.addEventListener("mousedown", function (e) {
        if (currentToolIndex == 2) {
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

            myCanvas.addEventListener("mousemove", onMouseMove);
        }
    });

    myCanvas.addEventListener("mouseup", function (e) {
        if (currentToolIndex == 2) {
            drawRect(x, y, w, h, primary);
            isDrawing = false;
            myCanvas.removeEventListener("mousemove", onMouseMove);
        }
    });

    function onMouseMove(e) {
        if (isDrawing && currentToolIndex == 2) {
            w = e.offsetX - x;
            h = e.offsetY - y;

            // Restore the saved canvas state
            ctx.putImageData(savedImageData, 0, 0);

            drawRect(x, y, w, h, primary, false);
        }
    }
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

function circleTool() {
    var x;
    var y;
    var r;
    var isDrawing = false;
    var savedImageData;

    myCanvas.addEventListener("mousedown", function (e) {
        if (currentToolIndex == 3) {
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

            myCanvas.addEventListener("mousemove", onMouseMove);
        }
    });

    myCanvas.addEventListener("mouseup", function (e) {
        if (currentToolIndex == 3) {
            drawCircle(x, y, r, primary);
            isDrawing = false;
            myCanvas.removeEventListener("mousemove", onMouseMove);
        }
    });

    function onMouseMove(e) {
        if (isDrawing && currentToolIndex == 3) {
            r = Math.sqrt(
                Math.pow(e.offsetX - x, 2) + Math.pow(e.offsetY - y, 2)
            );

            // Restore the saved canvas state
            ctx.putImageData(savedImageData, 0, 0);

            drawCircle(x, y, r, primary, false);
        }
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
clearCanvasButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
});

// Save As Image
const saveAsImageButton = document.getElementById("saveAsImageButton");
saveAsImageButton.addEventListener("click", function () {
    // The variable canvasUrl stores a data URL representing the image content of the canvas.
    var canvasUrl = myCanvas.toDataURL();

    const dummyAnchorElement = document.createElement("a");
    dummyAnchorElement.href = canvasUrl;

    dummyAnchorElement.download = "image";

    dummyAnchorElement.click();
    dummyAnchorElement.remove();
});