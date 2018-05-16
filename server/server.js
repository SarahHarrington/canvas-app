const http = require('http');
const express = require ('express');
const app = express();
const server = http.createServer(app);
let io = require('socket.io').listen(server);
const port = 5000;

app.use(express.static('server/public'));
let lineHistory = [];

io.on('connection', function(socket){
  // console.log('line history', lineHistory)
  // socket.on('lineHistory', function() {
  //   lineHistory.forEach(line => {
  //     io.emit('lineHistory', line);
  //   })
  // })
  console.log('a user connected');
  socket.on('lines', function(lines){
    lineHistory.push(lines);
  })
  console.log('lineHistory', lineHistory)
});

server.listen(port, function() {
  console.log('listening on port:', port)
})