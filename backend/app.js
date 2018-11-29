const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const createUserRouter = require('./user')

const methodsWithBody = ['POST', 'PUT']

const requestLogger = () => {
  morgan.token('clientIP', req => req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  morgan.token('requestBody', req => methodsWithBody.includes(req.method)
    ? `\n${JSON.stringify(req.body, null, ' ')}`
    : ''
  )
  const format = ':date[iso] [:clientIP] :method :url [:status] [:res[content-length] bytes] - :response-time[0]ms :user-agent :requestBody'

  const skip = () => process.env.TESTING !== undefined
  return morgan(format, { skip })
}

const createServer = (config, logger) => new Promise((resolve, reject) => {
  const app = express()

  app.use(bodyParser.json())
  app.use(requestLogger())

  app.use('/dstu', express.static('dist/'))
  app.use('/dstuapi', createUserRouter(config, logger))

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

module.exports = createServer
