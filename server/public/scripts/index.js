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
  let lineWidth = document.querySelector('.line-width').addEventListener('mouseup', updateLineWidth);
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

  // function windowResize() {
  //   console.log('the window is changing!!!!')
  //   let editor = document.querySelector('.editing-tools');
  //   console.log(canvas.width)
  //   editor.style.width = canvas.width;

  // }

  socket.on('newClientConnection', (data) => {
    document.body.appendChild(canvas);
    updateUsers(data);
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

  canvas.addEventListener('mousedown', (e) => {
    drawingActive = true;
    [mouse.endX, mouse.endY] = [e.offsetX, e.offsetY];
  });
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', (e) => {
    drawingActive = false
  });
  canvas.addEventListener('mouseout', () => drawingActive = false);
  // window.addEventListener('resize', windowResize);
}

document.addEventListener('DOMContentLoaded', domReady);
