const winston = require('winston')

const { createLogger, format, transports } = winston

const WinstonLogger = filename => {
  const winston = createLogger({
    format: format.printf(info => info.message),
    transports: [new transports.File({ filename })]
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

module.exports = WinstonLogger
