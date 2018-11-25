const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res, next) => {
  res.sendFile('/index.html')
})


const port = 3000;
server.listen(port);
console.log('App listening at port: ' + port);


io.on('connection', client => {
  console.log('Client connected...' + client);

  client.on('Dress', data => {
    console.log(data);
    client.broadcast.emit('Dress', data)
  })

  client.on('Previous Dress', data => {
    client.broadcast.emit('Previous Dress', data)
  })

  client.on('Next Dress', data => {
    client.broadcast.emit('Next Dress', data)
  })

  client.on('messages', data => {
    client.emit('broad', data);
    client.broadcast.emit('broad', data);
  })

})
