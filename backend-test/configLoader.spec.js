const should = require('chai').should()
const { stub, assert } = require('sinon')

const configLoader = require('../backend/configLoader')

const expectedConfigProperties = [
  'port', 'interface', 'dstuHost',
  'userIdPlaceholder', 'pagePlaceholder', 'userProfileTemplate'
]

describe('configuration selection', () => {
  let _nodeEnvStore
  const _loggerStub = { info: () => { } }

  before(() => { _nodeEnvStore = process.env.NODE_ENV })
  after(() => { process.env.NODE_ENV = _nodeEnvStore })

  afterEach(() => _loggerStub.info.restore())

  const setupConfig = expectedLogMessage => {
    stub(_loggerStub, 'info')
    const config = configLoader.get(_loggerStub)
    assertConfigProperties(config)
    assert.calledWith(_loggerStub.info, expectedLogMessage)
    return config
  }

  const assertConfigProperties = config => expectedConfigProperties.forEach(prop => {
    config.should.have.property(prop)
  })

  describe('return default configuration', () => {
    const runTest = () => {
      const config = setupConfig('using default environment configuration')

      config.port.should.equal(7000)
      config.interface.should.equal('127.0.0.1')
      config.dstuHost.should.equal('https://derstandard.at')
      config.userIdPlaceholder.should.equal('$UID$')
      config.pagePlaceholder.should.equal('$PAGE$')
      config.postingIdPlaceholder.should.equal('$POSTID$')
      config.userProfileTemplate.should.equal('/userprofil/postings/$UID$?pageNumber=$PAGE$&sortMode=1')
      config.postingRatingTemplate.should.equal('/forum/ratinglog?id=$POSTID$&idType=1')
      config.latestRaterIdPlaceholder.should.equal('$LRID$')
      config.postingRatingNextTemplate.should.equal('/Forum/RatingLog?id=$POSTID$&idType=Posting&LatestRaterCommunityIdentityId=$LRID$')
      should.not.exist(config.requestslog)
    }

    it('when no NODE_ENV', () => {
      delete process.env.NODE_ENV
      runTest()
    })

    it('when empty NODE_ENV', () => {
      process.env.NODE_ENV = ''
      runTest()
    })
  })

  describe('return specific configuration', () => {
    it('when PROD environment', () => {
      process.env.NODE_ENV = 'PROD'
      const config = setupConfig('using PROD environment configuration')

      config.port.should.equal(8001)
      config.requestslog.should.equal('dstu.requests.log')
    })

    it('when E2E environment', () => {
      process.env.NODE_ENV = 'E2E'
      const config = setupConfig('using E2E environment configuration')

      config.port.should.equal(5555)
      config.dstuHost.should.include('http://localhost:5556')
    })

    it('when LOCAL environment', () => {
      process.env.NODE_ENV = 'LOCAL'
      const config = setupConfig('using LOCAL environment configuration')

      config.port.should.equal(7001)
      config.dstuHost.should.include('http://localhost:5557')
      config.interface.should.equal('0.0.0.0')
    })
  })
})
