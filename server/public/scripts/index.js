console.log('javascript loaded');

function domReady() {
  const socket = io();
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  let drawingActive = false;
  let mouse = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    color: 'black',
    lineWidth: 5
  }

  canvas.classList.add('drawing');
  // canvas.height = Math.round(window.innerHeight * .9);
  // canvas.width = Math.round(window.innerWidth * .9);
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;

  socket.on('newClientConnection', (data) => {
    console.log('new client connected');
    console.log('data.id', data.id)
    document.body.appendChild(canvas);
  })

  let colors = document.querySelectorAll('.color');
  colors.forEach( (color) => {
    color.addEventListener('click', updateColor)
  })

  let lineWidth = document.querySelector('.line-width').addEventListener('mouseup', updateLineWidth);


  console.log(colors)

  function updateColor(e) {
    mouse.color = e.target.getAttribute('id');
    console.log(mouse.color)
  }

  function updateLineWidth(e) {
    console.log(e.target.value);
    mouse.lineWidth = parseInt(e.target.value);
    console.log(mouse.lineWidth);
  }

  function drawing(e) {
    if (!drawingActive) {
      return
    }
    ctx.strokeStyle = `${mouse.color}`;
    ctx.lineWidth = mouse.lineWidth;
    ctx.beginPath();
    ctx.moveTo(mouse.endX, mouse.endY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [mouse.startX, mouse.startY] = [mouse.endX, mouse.endY];
    [mouse.endX, mouse.endY] = [e.offsetX, e.offsetY];

    socket.emit('userDrawing', mouse);
  }

  socket.on('userDrawing', (line) => {
    ctx.strokeStyle = `${line.color}`;
    ctx.lineWidth = line.lineWidth;
    ctx.beginPath();
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.stroke();
  })

  canvas.addEventListener('mousedown', (e) => {
    drawingActive = true;
    [mouse.endX, mouse.endY] = [e.offsetX, e.offsetY];
  });
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', (e) => {
    drawingActive = false
    console.log(e);
    console.log(drawingActive)
  });
  canvas.addEventListener('mouseout', () => drawingActive = false);
}

document.addEventListener('DOMContentLoaded', domReady);