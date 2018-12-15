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

  const DEBUG = 0
  const debuglog = (msg, obj) => {
    if (DEBUG) {
      console.log(`-- ${msg} --`)
      if (obj) console.log(obj)
    }
  }

  const ws = path => new Promise((resolve, reject) => {
    const connectionUrl = wsAddress + path
    const websocket = new WebSocket(connectionUrl)
    const result = { data: 'closed' }

    websocket.on('open', () => {
      debuglog('open')
    })

    websocket.on('message', data => {
      debuglog('message', data)
      result.data = JSON.parse(data)
    })

    websocket.on('error', reject)

    websocket.on('close', ev => {
      debuglog('close', ev)
      resolve(result.data)
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
