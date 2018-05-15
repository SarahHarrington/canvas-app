const http = require('http');
const express = require ('express');
const app = express();
const server = http.createServer(app);
let io = require('socket.io').listen(server);
const port = 5000;

app.use(express.static('server/public'));
let lineHistory = [];

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('lines', function(lines){
    lineHistory = [...lines];
    io.emit('lineHistory', lineHistory);
  })
});

server.listen(port, function() {
  console.log('listening on port:', port)
})