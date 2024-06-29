// Get the canvas and context
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to draw with trails
function drawWithTrails(x,y) {
    // Clear the canvas
    clearCanvas();

    // Set transparency
    ctx.globalAlpha = 0.1;

    // Set fill style and draw the trail effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the moving object
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, 100-x, 100-y);
}

// Function to switch between drawings
function switchDrawing(drawingFunction) {
    clearCanvas();
    drawingFunction();
}

// Example of switching between two different drawings
function drawFirst() {
    // Clear the canvas
    clearCanvas();

    // Draw the first content
    ctx.fillStyle = 'red';
    ctx.fillRect(50, 50, 100, 100);
}

function drawSecond() {
    // Clear the canvas
    clearCanvas();

    // Draw the second content
    ctx.fillStyle = 'green';
    ctx.fillRect(150, 150, 100, 100);
}

// Example usage: switch between the two drawings
let x = 1, y = 1;
document.getElementById('button1').addEventListener('click', () => switchDrawing(drawFirst));
document.getElementById('button2').addEventListener('click', () => switchDrawing(drawSecond));
document.getElementById('button3').addEventListener('click', drawWithTrails(x,y));
function loop() {
  

  requestAnimationFrame(loop);
}

loop();