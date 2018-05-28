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
  let lastX;
  let lastY;
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
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
    [line.endX, line.endY] = [lastX, lastY];

    socket.emit('userDrawing', {
      line: line
    });

    socket.on('userDrawing', (line) => {
      console.log(line.line.startX)
    })

  }

  canvas.addEventListener('mousedown', (e) => {
    drawingActive = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    [line.startX, line.startY] = [e.offsetX, e.offsetY]
    // [line.endX, line.endY] = [e.offsetX, e.offsetY];
  });

  // canvas.addEventListener('mouseup', (e) => {
  //   drawingActive = false;
  //   [endX, endY] = [e.offsetX, e.offsetY];
  // });


  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', () => drawingActive = false);
  canvas.addEventListener('mouseout', () => drawingActive = false);
}

document.addEventListener('DOMContentLoaded', domReady);