const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('server/public'));

app.get('/', function(req, res) {
  res.sendFile('server/public' + '/index.html');
})

app.listen(port, function() {
  console.log('listening on port', port)
})