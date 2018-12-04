const DEFAULT = 'default'
const E2E = 'E2E'
const PROD = 'PROD'
const LOCAL = 'LOCAL'

const defaultEnv = {
  port: 7000,
  interface: '127.0.0.1',
  dstuHost: 'https://derstandard.at',
  userIdPlaceholder: '$UID$',
  pagePlaceholder: '$PAGE$',
  userProfileTemplate: `/userprofil/postings/$UID$?pageNumber=$PAGE$&sortMode=1`
}

const e2eEnv = {
  port: 5555,
  dstuHost: 'http://localhost:5556'
}

const localEnv = {
  port: 7001,
  dstuHost: 'http://localhost:5557'
}

const prodEnv = {
  port: 8001
}

const message = environment => `using ${environment} environment configuration`

const get = logger => {
  switch (process.env.NODE_ENV) {
    case PROD:
      logger.info(message(PROD))
      return Object.assign({}, defaultEnv, prodEnv)
    case E2E:
      logger.info(message(E2E))
      return Object.assign({}, defaultEnv, e2eEnv)
    case LOCAL:
      logger.info(message(LOCAL))
      return Object.assign({}, defaultEnv, localEnv)
    default:
      logger.info(message(DEFAULT))
      return defaultEnv
  }
}

module.exports = { get }
