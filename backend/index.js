const createServer = require('./app')
const config = require('./utils/dstuConfig')

const WinstonLogger = require('./utils/winstonLogger')

const logger = WinstonLogger(config.logfile)

const serverLog = msg => logger.info(`========== ${msg.padEnd(5)} ==========`)

const shutdown = () => {
  serverLog('STOP')
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

serverLog('START')
createServer(config, logger)
  .then(() => serverLog('UP'))
  .catch(err => {
    serverLog('ERROR')
    logger.error(err)
  })
