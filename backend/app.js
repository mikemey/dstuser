const express = require('express')
const expressWs = require('express-ws')
const expressStats = require('express-status-monitor')
const bodyParser = require('body-parser')

const { createRequestLogger } = require('./utils/requestsLogger')
const createPostingsRouter = require('./postings')
const createRatingsRouter = require('./ratings')

const statOptions = {
  title: 'derStandard.at comments',
  path: '/dstu/status',
  spans: [{
    interval: 1,
    retention: 60
  }, {
    interval: 10,
    retention: 60
  }, {
    interval: 60,
    retention: 60
  }, {
    interval: 300,
    retention: 60
  }]
}

const createServer = (config, logger) => new Promise((resolve, reject) => {
  const app = express()
  expressWs(app)
  app.use(expressStats(statOptions))

  app.use(bodyParser.json())
  app.use(createRequestLogger(config))

  app.use('/dstu', express.static('dist/'))
  app.use('/dstu/ws', createPostingsRouter(config, logger))
  app.use('/dstu/ws', createRatingsRouter(config, logger))

  const server = app.listen(config.port, config.interface, () => {
    logger.info(`Started on port ${server.address().port}`)
    return resolve({ app, server })
  })

  server.once('error', err => {
    logger.error(`server error: ${err.message}`)
    logger.log(err)
    return reject(err)
  })
})

module.exports = { createServer }
