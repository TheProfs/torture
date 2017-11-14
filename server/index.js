'use strict'

const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 30000
})
const ConcRequest = require('./conc-request')
const concRequest = new ConcRequest()

io.set('transports', ['websocket'])
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

app.get('/', (req, res) => {
  res.render(path.join(__dirname, '../index.html'))
})

app.get('/start', (req, res) => {
  try {
    concRequest.start({
      url: req.query.url,
      concrequests: parseInt(req.query.concrequests)
    })
    res.sendStatus(204)
  } catch(err) {
    console.error(err)
    res.status(500).send(err.toString())
  }
})

app.get('/abort', (req, res) => {
  try {
    concRequest.abortRunningRequests()
    res.sendStatus(204)
  } catch(err) {
    console.error(err)
    res.status(500).send(err.toString())
  }
})

app.get('/reset', (req, res) => {
  try {
    concRequest.reset()
    res.sendStatus(204)
  } catch(err) {
    console.error(err)
    res.status(500).send(err.toString())
  }
})

io.on('connection', socket => {
  concRequest.addSubscriber(socket)

  socket.on('disconnect', () => {
    concRequest.removeSubscriber(socket)
  })
})

server.listen(app.get('port'), () => {
  console.info(`Torture app listening on: ${app.get('port')}`)
})
