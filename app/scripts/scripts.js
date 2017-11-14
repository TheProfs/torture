window.onload = () => {
  const barChart = Chart.Bar(document.querySelector('#chart-canvas'), {
    data: {
        labels: [],
        datasets: [
          {
            label: 'Chunks Received',
            backgroundColor: 'rgba(63, 81, 181, 0.3)',
            borderColor: 'rgba(63, 81, 181, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(233, 30, 99, 1)',
            hoverBorderColor: 'rgba(233, 30, 99, 1)',
            data: []
          }
        ]
    },
    options: {
      scales: {
        yAxes:[{
            stacked: true,
            gridLines: {
              display: true,
              color: 'rgba(238, 238, 238, 1)'
            }
        }],
        xAxes:[{
          gridLines: {
            display:false
          }
        }]
      }
    }
  })

  window.requestStart = () => {
    const url = document.querySelector('#url-input').value
    const concrequests = document.querySelector('#conc-requests-input').value

    fetch(`${window.location.protocol}//${window.location.host}/start?url=${url}&concrequests=${concrequests}`)
      .then(() => {
        console.info('test started...')
      })
      .catch(err => {
        console.error(err)
      })
  }

  window.requestAbort = () => {
    fetch(`${window.location.protocol}//${window.location.host}/abort`)
      .then(() => {
        console.info('Aborted all running requests..')
      })
      .catch(err => {
        console.error(err)
      })
  }

  window.requestReset = () => {
    fetch(`${window.location.protocol}//${window.location.host}/reset`)
      .then(() => {
        console.info('Reset all..')
        resetChart()
        emptyNotificationsContainer()
      })
      .catch(err => {
        console.error(err)
      })
  }

  const updateChart = data => {
    const i = barChart.data.labels.indexOf(`Request: ${data.request}`)

    if (i > -1) {
      barChart.data.datasets[0].data[i] = data.count
      barChart.update()
      return
    }

    barChart.data.labels.push(`Request: ${data.request}`)
    barChart.data.datasets[0].data.push(data.count)

    barChart.update()
  }

  const appendNotification = notification => {
    document.querySelector('#status-container-inner')
      .insertAdjacentHTML(
        'afterBegin',
        `<p class=${notification.type}>${notification.time} - ${notification.text}</p>`
      )
  }

  const resetChart = () => {
    barChart.data.labels = []
    barChart.data.datasets[0].data = []
    barChart.update()
  }

  const emptyNotificationsContainer = () => {
    document.querySelector('#status-container-inner').innerHTML = ''
  }

  const socket = io(`${window.location.protocol}//${window.location.host}`, {
    transports: ['websocket']
  })

  socket.on('data', updateChart)
  socket.on('status', appendNotification)
}
