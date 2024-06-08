// Change toolbar active element
var toolBar = document.getElementById("toolBar");
var toolItems = document.getElementsByClassName("tool-item");

for (var i = 0; i < toolItems.length; i++) {
    toolItems[i].addEventListener("click", function() {
        for (var j = 0; j < toolItems.length; j++) {
            toolItems[j].classList.remove("active");
        }
        this.classList.add("active");
    });
}

// Canvas stuff
const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

var style = getComputedStyle(document.body)
const text = style.getPropertyValue('--text');
const background = style.getPropertyValue('--background');
const primary = style.getPropertyValue('--primary');
const secondary = style.getPropertyValue('--secondary');
const accent = style.getPropertyValue('--accent');

myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;

// Clear Canvas
const clearCanvasButton = document.getElementById("clearCanvasButton");

clearCanvasButton.addEventListener("click", function() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
});

function clearCanvas() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
}