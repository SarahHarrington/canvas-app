const express = require ('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/public`));

let drawing = {
  clients: {},
  paths: {},
  last: {}
}

let users = [];

io.on('connection', socket => {
  console.log('a user connected');
  drawing.clients[socket.id] = socket.id;
  users.push(socket.id);
  socket.emit('newClientConnection', users.length)
  io.emit('newClientConnection', users.length);
  socket.on('userDrawing', line => {    
    socket.broadcast.emit('userDrawing', line);
  })

  socket.on('cleanCanvas', e => {
    io.emit('cleanCanvas', e);
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    users.pop();
    io.emit('clientDisconnected', users.length);
  })
});



http.listen(PORT, '127.0.0.1');
console.log(`listening on port ${PORT}`);