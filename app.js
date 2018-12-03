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

let dresses = [{
        name: 'yellow dress',
        image: 'https://connaisseurparis.com/wp-content/uploads/2018/08/D61A7128-291D-43D6-9809-8ED7E3FB07A1-682x1024-266x400.jpeg',
        description: 'no sure dress',
        rating: 3
      }]
io.on('connection', client => {
  console.log('Client connected...' + client);
  client.emit('Welcome', 'hello')

  client.on('Dress', data => {
    console.log(dresses);
    if(data != dresses[dresses.length - 1]){
      client.broadcast.emit('Dress', data)
    }
  })

  client.on('subscribeToDress', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    client.emit('dress', dresses)
  });


  client.on('Next Dress', data => {
    client.broadcast.emit('Next Dress', data)
  })

  client.on('Previous Dress', data => {
    client.broadcast.emit('Previous Dress', data)
  })

  client.on('Reset', data => {
    dresses = []
    client.broadcast.emit(dresses)
  })

  client.on('Reset to Point', data => {
    client.broadcast.emit(dresses.splice(data))
  })

})
