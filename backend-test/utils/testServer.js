const supertest = require('supertest')
const createServer = require('../../backend/app')

const testConfig = {
  serverPort: 12121
}

const createQuietLogger = () => {
  return {
    info: () => { },
    error: console.error,
    log: () => { }
  }
}

const TestServer = () => {
  let app, server
  process.env.TESTING = 'true'

  const start = () => createServer(testConfig, createQuietLogger())
    .then(dstuServer => {
      app = dstuServer.app
      server = dstuServer.server
    })

  const stop = () => server
    ? new Promise(resolve => server.close(resolve))
    : Promise.resolve()

  const request = () => supertest(app)

  return {
    start,
    stop,
    request
  }
}

module.exports = TestServer
