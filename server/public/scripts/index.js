console.log('javascript loaded');

function domReady() {
  const socket = io();
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.classList.add('drawing');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  ctx.strokeStyle = '#6600cc';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;

  socket.on('newClientConnection', (data) => {
    console.log('new client connected');
    console.log('data.id', data.id)
    document.body.appendChild(canvas);
  })

  // const canvasArea = document.querySelector('#drawing');

  let drawingActive = false;
  // let lastX;
  // let lastY;
  let mouse = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }
  // let lines = [];

  let line = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }

  function drawing(e) {
    if (!drawingActive) {
      return
    }
    // console.log(e);
    ctx.beginPath();
    ctx.moveTo(mouse.startX, mouse.startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    // [line.endX, line.endY] = [e.offsetX, e.offsetY];

    [mouse.startX, mouse.startY] = [e.offsetX, e.offsetY];

    socket.emit('userDrawing', {
      line: line
    });
  }

  socket.on('userDrawing', (line) => {
    ctx.beginPath();
    ctx.moveTo(line.line.startX, line.line.startY);
    ctx.lineTo(line.line.endX, line.line.endY);
    ctx.stroke();
  })

  canvas.addEventListener('mousedown', (e) => {
    drawingActive = true;
    [mouse.startX, mouse.startY] = [e.offsetX, e.offsetY];
    [line.startX, line.startY] = [mouse.startX, mouse.startY]
    // [line.endX, line.endY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', (e) => {
    drawingActive = false
    console.log(e);
    console.log(drawingActive)
    // [line.endX, line.endY] = [e.offsetX, e.offsetY];
  });
  canvas.addEventListener('mouseout', () => drawingActive = false);
}

document.addEventListener('DOMContentLoaded', domReady);