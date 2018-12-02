const supertest = require('supertest')

const TestDataLoader = require('../../test-data/testDataLoader')
const app = require('../../backend/app')

const testConfig = {
  dstuHost: 'https://dstu.com',
  userIdPlaceholder: '$UID$',
  pagePlaceholder: '$PAGE$',
  userProfileTemplate: '/userprofil/postings/$UID$?page=$PAGE$'
}

const createQuietLogger = () => {
  return {
    info: () => { },
    error: console.error,
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
    testData: TestDataLoader.testData,
    testDataAsJson: TestDataLoader.testDataAsJson,
    config: testConfig
  }
}

module.exports = TestServer
