const express = require('express')
const expressWs = require('express-ws')
const bodyParser = require('body-parser')

const { createRequestLogger } = require('./utils/requestsLogger')
const createUserRouter = require('./user')
const createWsRouter = require('./rating')

const createServer = (config, logger) => new Promise((resolve, reject) => {
  const app = express()
  expressWs(app)

  app.use(bodyParser.json())
  app.use(createRequestLogger(config))

  app.use('/dstu', express.static('dist/'))
  app.use('/dstuapi', createUserRouter(config, logger))
  app.use('/dstuws', createWsRouter(config, logger))

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
