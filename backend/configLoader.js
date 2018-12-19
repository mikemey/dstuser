const DEFAULT_ENV = 'default'
const E2E_ENV = 'E2E'
const PROD_ENV = 'PROD'
const LOCAL_ENV = 'LOCAL'

const defaultEnv = {
  port: 7000,
  interface: '127.0.0.1',
  dstuHost: 'https://derstandard.at',
  userIdPlaceholder: '$UID$',
  pagePlaceholder: '$PAGE$',
  postingIdPlaceholder: '$POSTID$',
  userProfileTemplate: '/userprofil/postings/$UID$?pageNumber=$PAGE$&sortMode=1',
  postingRatingTemplate: '/forum/ratinglog?id=$POSTID$&idType=1',
  latestRaterIdPlaceholder: '$LRID$',
  postingRatingNextTemplate: '/Forum/RatingLog?id=$POSTID$&idType=Posting&LatestRaterCommunityIdentityId=$LRID$'
}

const e2eEnv = {
  port: 5555,
  dstuHost: 'http://localhost:5556'
}

const localEnv = {
  port: 7001,
  dstuHost: 'http://localhost:5557',
  interface: '0.0.0.0'
}

const prodEnv = {
  port: 8001,
  requestslog: 'dstu.requests.log'
}

const message = environment => `using ${environment} environment configuration`

const get = logger => {
  switch (process.env.NODE_ENV) {
    case PROD_ENV:
      logger.info(message(PROD_ENV))
      return Object.assign({}, defaultEnv, prodEnv)
    case E2E_ENV:
      logger.info(message(E2E_ENV))
      return Object.assign({}, defaultEnv, e2eEnv)
    case LOCAL_ENV:
      logger.info(message(LOCAL_ENV))
      return Object.assign({}, defaultEnv, localEnv)
    default:
      logger.info(message(DEFAULT_ENV))
      return defaultEnv
  }
}

module.exports = { get }
