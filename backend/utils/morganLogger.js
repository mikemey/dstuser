const fs = require('fs')
const morgan = require('morgan')

const dateFormat = require('./logDateFormat')

const methodsWithBodyLog = ['POST', 'PUT']

const createRequestLogger = config => {
  morgan.token('dateTime', dateFormat)
  morgan.token('clientIP', req => req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  morgan.token('requestBody', req => methodsWithBodyLog.includes(req.method)
    ? `\n${JSON.stringify(req.body, null, ' ')}`
    : ''
  )
  const format = '[:dateTime] [:clientIP] :method :url [:status] [:res[content-length] bytes] - :response-time[0]ms :user-agent :requestBody'

  const options = {}
  options.skip = () => process.env.TESTING !== undefined
  if (config.requestslog) {
    options.stream = fs.createWriteStream(config.requestslog, { flags: 'a' })
  }

  return morgan(format, options)
}

module.exports = { createRequestLogger }
