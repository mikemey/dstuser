const supertest = require('supertest')

const app = require('../../backend/app')

const testConfig = {
  dstuHost: 'https://dstu.com',
  userIdPlaceholder: '$UID$',
  pagePlaceholder: '$PAGE$',
  postingIdPlaceholder: '$POSTID$',
  userProfileTemplate: '/userprofil/postings/$UID$?pageNumber=$PAGE$&sortMode=1',
  postingRatingTemplate: '/ratinglog?id=$POSTID$&idType=1'
}
// "https://derstandard.at/forum/ratinglog?id=$POSTID$&idType=1"  -H 'X-Requested-With: XMLHttpRequest'
const createQuietLogger = () => {
  return {
    info: () => { },
    error: () => { },
    log: () => { }
  }
}

const TestServer = () => {
  let _app, server
  process.env.TESTING = 'true'

  const start = () => app.createServer(testConfig, createQuietLogger())
    .then(dstuServer => {
      _app = dstuServer.app
      server = dstuServer.server
    })

  const stop = () => server
    ? new Promise(resolve => server.close(resolve))
    : Promise.resolve()

  const request = () => supertest(_app)

  return {
    start,
    stop,
    request,
    config: testConfig
  }
}

module.exports = TestServer
