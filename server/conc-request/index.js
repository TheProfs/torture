'use strict'

const async = require('async')
const request = require('request')
const _ = require('underscore')

class ConcRequest {
  constructor() {
    this.subscribers = []
    this.runningRequests = []
    this.notifications = []
    this._emitThrottledDataUpdate = _.throttle(({ n, count }) => {
      this._notifySubscribers('data', { request: n, count: ++count })
    }, 500)
  }

  addSubscriber(socket) {
    this.subscribers.push(socket)
    this.notifications.forEach(notification => {
      socket.emit(notification.type, notification.data)
    })
    return this
  }

  removeSubscriber(socket) {
    this.subscribers = this.subscribers.filter(subscriber =>
      subscriber.id !== socket.id
    )

    return this
  }

  start({ url, concrequests}) {
    this.abortRunningRequests()
    this._notifySubscribers('status', {
      type: 'info',
      text: `Started ${concrequests} requests`
    })

    async.timesLimit(concrequests, concrequests, (n, next) => {
      let count = 0

      const pendingRequest = request({
        method: 'GET',
        uri: url
      }, (error, response, body) => {
          if (error) {
            next(error)
            return
          }

          next()
        }
      )
      .on('data', data => {
        count++

        if (count === 1) {
          this._notifySubscribers('data', { request: n, count })
        } else {
          this._emitThrottledDataUpdate({ n, count })
        }
      })

      this.runningRequests.push(pendingRequest)
    }, err => {
      this._clearRunningRequests()

      if (err) {
        this._notifySubscribers('status', {
          type: 'success',
          text: `An error occured: ${err.toString()}`
        })

        return
      }

      this._notifySubscribers('status', {
        type: 'success',
        text: `${concrequests} requests completed succefully`
      })
    })

    return this
  }

  abortRunningRequests() {
    if (!this.runningRequests.length) return this

    this.runningRequests.forEach(request => {
      request.abort()
    })

    this._notifySubscribers('status', {
      type: 'warning',
      text: 'Aborted all running requests'
    })

    return this
  }

  reset() {
    this.abortRunningRequests()
    this.notifications = []

    return this
  }

  _notifySubscribers(type, data) {
    const now = new Date()
    const notification = {
      type,
      data: Object.assign(data, {
        time: this._getTime()
      })
    }

    this.notifications.push(notification)
    this.subscribers.forEach(socket => {
      socket.emit(notification.type, notification.data)
    })

    return this
  }

  _clearRunningRequests() {
    this.runningRequests = []

    return this
  }

  _getTime() {
    return new Date(new Date().getTime()).toLocaleTimeString()
  }
}


module.exports = ConcRequest
