console.log('javascript loaded');

function domReady() {
  const socket = io();

  socket.on('newClientConnection', (data) => {
    console.log('new client connected');
    console.log('data.id', data.id)
    
  })
  // const canvas = document.querySelector('.drawing');
  // const ctx = canvas.getContext('2d');
  // canvas.height = window.innerHeight;
  // canvas.width = window.innerWidth;
  // ctx.strokeStyle = '#6600cc';
  // ctx.lineJoin = 'round';
  // ctx.lineCap = 'round';
  // ctx.lineWidth = 5;

  // let drawingActive = false;
  // let lastX;
  // let lastY;
  // let lines = [];
  
  // function drawing(e) {
  //   if (!drawingActive) {
  //     return
  //   }
    
  //   let line = {
  //     startX: 0,
  //     startY: 0,
  //     endX: 0,
  //     endY: 0
  //   }
  //   socket.emit('userDrawing', function(line){
  //     console.log('data', line)
  //   })

  //   // console.log(e);
  //   ctx.beginPath();
  //   ctx.moveTo(lastX, lastY);
  //   ctx.lineTo(e.offsetX, e.offsetY);
  //   ctx.stroke();

  //   [lastX, lastY] = [e.offsetX, e.offsetY];

  // }

  

  // canvas.addEventListener('mousedown', (e) => {
  //   drawingActive = true;
  //   [startX, startY] = [e.offsetX, e.offsetY]
  //   [lastX, lastY] = [e.offsetX, e.offsetY];
  // });

  // canvas.addEventListener('mouseup', (e) => {
  //   drawingActive = false;
  //   [endX, endY] = [e.offsetX, e.offsetY];
  // });


  // canvas.addEventListener('mousemove', drawing);
  // // canvas.addEventListener('mouseup', () => drawingActive = false);
  // canvas.addEventListener('mouseout', () => drawingActive = false);
}

document.addEventListener('DOMContentLoaded', domReady);