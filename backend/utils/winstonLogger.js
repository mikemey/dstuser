const moment = require('moment')
const { createLogger, format, transports } = require('winston')

const create = () => {
  const winston = createLogger({
    format: format.combine(
      format.timestamp({ format: () => moment().utc().format('YYYY-MM-DD HH:mm:ss z') }),
      format.printf(info => `[${info.timestamp}] ${info.message}`)
    ),
    transports: [new transports.Console()]
  })

  return {
    info: msg => winston.info(msg),
    log: obj => winston.info(JSON.stringify(obj, null, ' ')),
    error: (msg, err) => {
      winston.error(msg)
      if (err) winston.error(err.stack)
    }
  }
}

module.exports = { create }
