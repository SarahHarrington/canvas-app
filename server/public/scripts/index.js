function domReady() {
  const socket = io();

  // window.addEventListener('resize', resizeCanvas);

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

  //Collects colors and adds event listeners to paint brushes
  let colors = document.querySelectorAll('.color');
  colors.forEach( (color) => {
    color.addEventListener('click', updateColor);
  })

  //Collects erasers and adds event listeners to erasers
  let erasers = document.querySelectorAll('.eraser');
  erasers.forEach((eraser) => {
    eraser.addEventListener('click', eraserTime);
  });

  let lineWidth = document.querySelector('.line-width').addEventListener('mouseup', updateLineWidth);
  let clean = document.querySelector('.clean').addEventListener('click', cleanCanvas);

  // function resizeCanvas() {
  //   canvas.height = window.innerHeight;
  //   canvas.width = window.innerWidth;
  // }

  function updateColor(e) {
    mouse.color = e.currentTarget.getAttribute('id');
  }

  function updateLineWidth(e) {
    mouse.lineWidth = parseInt(e.target.value);
  }

  function eraserTime(e) {
    console.log(e.target.classList.contains('10'));
    mouse.color = 'white';
    if (e.target.classList.contains('5') === true) {
      mouse.lineWidth = 5;
    }
    if (e.target.classList.contains('25') === true) {
      mouse.lineWidth = 25;
    }
    if (e.target.classList.contains('100') === true) {
      mouse.lineWidth = 100;
    }
  }

  function cleanCanvas(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('cleanCanvas', e)
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

  socket.on('cleanCanvas', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  })

  canvas.addEventListener('mousedown', (e) => {
    drawingActive = true;
    [mouse.endX, mouse.endY] = [e.offsetX, e.offsetY];
  });
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', (e) => {
    drawingActive = false
  });
  canvas.addEventListener('mouseout', () => drawingActive = false);
}

document.addEventListener('DOMContentLoaded', domReady);
