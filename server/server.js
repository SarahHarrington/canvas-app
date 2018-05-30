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

io.on('connection', socket => {
  console.log('a user connected');
  console.log(socket.id)
  drawing.clients[socket.id] = socket.id;
  console.log(drawing.clients)

  socket.emit('newClientConnection', {
    id: socket.id
  })

  socket.on('userDrawing', line => {    
    io.emit('userDrawing', line)
  })

});

http.listen(PORT, () => console.log(`listening on port ${PORT}`));