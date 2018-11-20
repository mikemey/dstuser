const winston = require('winston')

const { createLogger, format, transports } = winston

const prodEnvironment = process.env.NODE_ENV === 'PROD'

const WinstonLogger = filename => {
  const output = prodEnvironment
    ? new transports.File({ filename })
    : new transports.Console({ format: format.simple() })

  const winston = createLogger({
    format: format.printf(info => info.message),
    transports: output
  })

  if (!prodEnvironment) {
    winston.info('!!!!!!!!!!!!!!!!!!!!')
    winston.info('STARTING IN DEV MODE')
    winston.info('!!!!!!!!!!!!!!!!!!!!')
  }
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
