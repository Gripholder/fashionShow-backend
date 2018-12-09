const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res, next) => {
  res.sendFile('/index.html')
})


const port = process.env.PORT || 3001;
server.listen(port);
console.log('App listening at port: ' + port);

let dresses = [{
        name: '',
        image: 'https://ibb.co/n8VWWHJ',
        url: '#'
      }]

let ratingList = [[]]

const averageRating = id => {
  console.log('rating id' + id)
  console.log(ratingList)
    let result = 0;
    for (let i = 0; i < ratingList[id].length; i++) {
      if(ratingList[id][i] != 0){
        result += ratingList[id][i]
      }
      }
      result = result / ratingList[id].length
      console.log('average Rating ' + result)
      return Math.round(result)

}

io.on('connection', client => {
  console.log('Client connected...' + client.handshake.address);
  client.emit('Welcome', 'hello')

  client.on('Dress', data => {
    ratingList.push([])
    if(data != dresses[dresses.length - 1]){
      client.broadcast.emit('Dress', data)
    }
    dresses.push(data)
  })

  client.on('Get Dresses', data => {
    client.emit('Current Dresses', dresses)
  })

  client.on('Submit Rating', data => {
    if(ratingList[data[0]]){
      ratingList[data[0]].push(data[1])
    } else {
      console.log('rating not available')
    }
    let rate = averageRating(data[0])
    client.broadcast.emit('Rating', rate)
    client.emit('Rating', rate)
  })

  client.on('Get Rating', id => {
    let avgRating = averageRating(id)
    console.log('sending rating' + id)
    console.log('getting rating average ' + avgRating)
    console.log('ratings: ' + ratingList)
    if(avgRating == NaN){
      client.emit('Rating', 0)
    } else {
      client.emit('Rating', avgRating)
    }
  })

  client.on('subscribeToDress', data => {
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
