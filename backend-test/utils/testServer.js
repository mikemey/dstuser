const supertest = require('supertest')
const WebSocket = require('ws')

const backendApp = require('../../backend/app')

const testConfig = {
  dstuHost: 'https://dstu.com',
  userIdPlaceholder: '$UID$',
  pagePlaceholder: '$PAGE$',
  postingIdPlaceholder: '$POSTID$',
  userProfileTemplate: '/userprofil/postings/$UID$?pageNumber=$PAGE$&sortMode=1',
  postingRatingTemplate: '/ratinglog?id=$POSTID$&idType=1',
  latestRaterIdPlaceholder: '$LRID$',
  postingRatingNextTemplate: '/Forum/RatingLog?id=$POSTID$&idType=Posting&LatestRaterCommunityIdentityId=$LRID$'
}

const createQuietLogger = () => {
  return {
    info: () => { },
    error: () => { },
    log: () => { }
  }
}

const TestServer = () => {
  let app, server, wsAddress
  process.env.TESTING = 'true'

  const start = () => backendApp.createServer(testConfig, createQuietLogger())
    .then(dstuServer => {
      app = dstuServer.app
      server = dstuServer.server
      wsAddress = `ws://127.0.0.1:${server.address().port}`
    })

  const stop = () => server
    ? new Promise(resolve => server.close(resolve))
    : Promise.resolve()

  const request = () => supertest(app)

  const ws = path => new Promise((resolve, reject) => {
    const connectionUrl = wsAddress + path
    const websocket = new WebSocket(connectionUrl)
    const result = { data: [], status: 'init' }

    websocket.on('open', () => {
      result.status = 'open'
    })

    websocket.on('message', data => {
      result.status = 'message'
      result.data.push(JSON.parse(data))
    })

    websocket.on('error', err => {
      result.status = 'error'
      reject(err)
    })

    websocket.on('close', ev => {
      result.status = 'closed'
      resolve(result)
    })
  })

  return {
    start,
    stop,
    request,
    ws,
    config: testConfig
  }
}

module.exports = TestServer
