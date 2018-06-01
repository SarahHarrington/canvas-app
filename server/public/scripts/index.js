function domReady() {
  const socket = io();
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.classList.add('drawing');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;
  
  // let canvasSize = document.getElementsByTagName('canvas');
  // console.log('canvasSize', canvasSize);
  
  let drawingActive = false;
  let mouse = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    color: 'black',
    lineWidth: 5
  }
  let users = [];
  let usersNum = document.querySelector('.usersNum');
  let lineWidth = document.querySelector('.line-width');
  let clean = document.querySelector('.clean').addEventListener('click', cleanCanvas);

  //Collects colors and adds event listeners to paint brushes
  let colors = document.querySelectorAll('.color');
  colors.forEach((color) => {
    color.addEventListener('click', updateColor);
  })

  //Collects erasers and adds event listeners to erasers
  let erasers = document.querySelectorAll('.eraser');
  erasers.forEach((eraser) => {
    eraser.addEventListener('click', eraserTime);
  });

  function updateColor(e) {
    colors.forEach((color) => color.classList.remove('active-tool'));
    erasers.forEach((eraser) => eraser.classList.remove('active-tool'));
    if (e.target.classList.contains('active-tool') === false) {
      e.target.classList.add('active-tool')
    }
    mouse.color = e.currentTarget.getAttribute('id');
  }

  function updateLineWidth(e) {
    console.log(e.target.value);
    mouse.lineWidth = parseInt(e.target.value);
  }

  function eraserTime(e) {
    erasers.forEach((eraser) => eraser.classList.remove('active-tool'));
    colors.forEach((color) => color.classList.remove('active-tool'));
    mouse.color = 'white';
    if (e.target.classList.contains('5') === true) {
      mouse.lineWidth = 5;
      e.target.classList.add('active-tool');
    }
    if (e.target.classList.contains('25') === true) {
      mouse.lineWidth = 25;
      e.target.classList.add('active-tool');
    }
    if (e.target.classList.contains('100') === true) {
      mouse.lineWidth = 100;
      e.target.classList.add('active-tool');
    }
  }

  function cleanCanvas(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('cleanCanvas', e)
  }

  function updateUsers (num) {
    usersNum.innerHTML = num;
  }

  function drawing(e) {
    console.log(e);
    e.preventDefault();
    if (!drawingActive) {
      return
    }
    if (e.type === 'mousemove') {
      ctx.strokeStyle = `${mouse.color}`;
      ctx.lineWidth = mouse.lineWidth;
      ctx.beginPath();
      ctx.moveTo(mouse.endX, mouse.endY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [mouse.startX, mouse.startY] = [mouse.endX, mouse.endY];
      [mouse.endX, mouse.endY] = [e.offsetX, e.offsetY];
    }
    if (e.type === 'touchmove') {
      ctx.strokeStyle = `${mouse.color}`;
      ctx.lineWidth = mouse.lineWidth;
      ctx.beginPath();
      ctx.moveTo(mouse.endX, mouse.endY);
      ctx.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY - offsetTop);
      ctx.stroke();
      [mouse.startX, mouse.startY] = [mouse.endX, mouse.endY];
      [mouse.endX, mouse.endY] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY - offsetTop];
    }
    socket.emit('userDrawing', mouse);
  }

  let offsetTop = 0;
  socket.on('newClientConnection', (data) => {
    document.body.appendChild(canvas);
    updateUsers(data);
    offsetTop = document.getElementsByTagName('canvas')["0"].offsetTop;
    console.log(offsetTop)
  })

  socket.on('clientDisconnected', (data) => {
    updateUsers(data)
  });

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

  //event listeners for computer
  canvas.addEventListener('mousedown', (e) => {
    drawingActive = true;
    [mouse.endX, mouse.endY] = [e.offsetX, e.offsetY];
  });
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', (e) => {
    drawingActive = false
  });
  canvas.addEventListener('mouseout', () => drawingActive = false);

  //event listeners for touch device
  canvas.addEventListener('touchstart', (e) => {
    drawingActive = true;
    [mouse.endX, mouse.endY] = [e.touches[0].pageX, e.touches[0].pageY - offsetTop];
  })
  canvas.addEventListener('touchmove', drawing);
  canvas.addEventListener('touchend', (e) => {
    drawingActive = false;
  })
  canvas.addEventListener('touchcancel', () => drawingActive = false);

  lineWidth.addEventListener('mouseup', updateLineWidth);
  lineWidth.addEventListener('touchend', updateLineWidth);
}

document.addEventListener('DOMContentLoaded', domReady);
