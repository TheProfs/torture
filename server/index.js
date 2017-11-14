'use strict'

const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const async = require('async')
const request = require('request')
const argv = require('nomnom').parse()
const cors = require('cors')
const io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 30000
})

io.set('transports', ['websocket']);
app.use('/', express.static(path.join(__dirname, '../app')))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.set('port', (process.env.PORT || 3001))
app.use(cors({
  credentials: true,
  origin: [
    'http://127.0.0.1:8081',
    'https://experiments.bitpaper.io'
  ]
}))

let subscribers = []

app.get('/', (req, res) => {
  res.render(path.join(__dirname, '../index.html'))
})

app.get('/start', (req, res) => {
  async.timesLimit(
    parseInt(req.query.concrequests),
    parseInt(req.query.concrequests),
    (n, next) => {

    let count = 0
    request({ method: 'GET', uri: req.query.url }, (error, response, body) => {
        if (error) {
          next(error)
          return
        }

        next()
      }
    )
    .on('data', data => {
      if (++count % 100 === 0) {
        subscribers.forEach(socket => {
          socket.emit('data', { request: n, count })
        })
      }
    })
  }, err => {
    if (err) {
      console.error(err)
      return
    }

    console.info('Done')
  });

  res.sendStatus(204)
})

io.on('connection', socket => {
  subscribers.push(socket)

  socket.on('disconnect', () => {
    subscribers = subscribers.filter(subscriber => subscriber.id !== socket.id)
  })
})

server.listen(app.get('port'), function () {
  console.log(`Torture app listening on: ${app.get('port')}`)
})
