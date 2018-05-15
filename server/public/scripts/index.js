console.log('javascript loaded');
const canvas = document.querySelector('.drawing');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
ctx.strokeStyle = '#6600cc';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 5;

let drawingActive = false;
let lastX = 0;
let lastY = 0;
let lines = [];

function drawing(e) {
  if (!drawingActive) {
    return
  }
  let line = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }
  console.log(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  line = {
    startX: lastX,
    startY: lastY,
    endX: e.offsetX,
    endY: e.offsetY
  }
  lines.push(line);
  [lastX, lastY] = [e.offsetX, e.offsetY];
  console.log(lines);
}

canvas.addEventListener('mousedown', (e) => {
  drawingActive = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];

});

canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => drawingActive = false);
canvas.addEventListener('mouseout', () => drawingActive = false);