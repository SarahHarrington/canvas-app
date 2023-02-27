const express = require ('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/public`));

let drawing = {
  users: [],
  lineHistory: []
}

io.on('connection', socket => {
  console.log('a user connected');
  drawing.users.push(socket.id);
  socket.emit('newClientConnection', drawing)
  io.emit('newClientConnection', drawing);
  socket.on('userDrawing', line => {    
    socket.broadcast.emit('userDrawing', line);
    drawing.lineHistory.push(line);
  })

  socket.on('cleanCanvas', e => {
    drawing.lineHistory = [];
    io.emit('cleanCanvas', e);
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    drawing.users.pop();
    io.emit('clientDisconnected', drawing.users.length);
  })
});


http.listen(PORT, '0.0.0.0');
console.log(`listening on port ${PORT}`)