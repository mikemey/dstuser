const nock = require('nock')
const TestServer = require('../utils/testServer')
const TestDataLoader = require('../../test-data/testDataLoader')

describe('ratings websocket', () => {
  const userId = 755005
  const server = TestServer()
  const testConfig = server.config
  const dataLoader = TestDataLoader(testConfig.dstuHost)

  before(() => {
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
    return server.start()
  })

  after(() => {
    nock.enableNetConnect()
    return server.stop()
  })

  afterEach(nock.cleanAll)

  const testRating = postingId => dataLoader.getRating(userId, postingId)
  const expectedData = postingId => dataLoader.getRatingResult(userId, postingId)

  const postingRatingUrl = postId => testConfig.postingRatingTemplate
    .replace(testConfig.postingIdPlaceholder, postId)

  const nockPostingRating = postingId => nock(testConfig.dstuHost, {
    reqheaders: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).get(postingRatingUrl(postingId))

  const requestRating = (postingId = '') => server.ws(`/dstuws/rating/${postingId}`)

  describe('request posting ratings', () => {
    it('responds with only positive ratings', () => runRatingsTest(1036279475))

    it('responds with only negative ratings', () => runRatingsTest(1034368216))

    it('responds with positive and negative ratings', () => runRatingsTest(1034153378))

    const runRatingsTest = postingId => {
      nockPostingRating(postingId).reply(200, testRating(postingId))
      return requestRating(postingId)
        .then(response => {
          response.should.deep.equal(expectedData(postingId))
        })
    }
  })

  describe('invalid requests', () => {
    it('NaN received', () => {
      const postingId = 'abc'
      return requestRating(postingId)
        .then(response => {
          response.should.deep.equal({ error: `invalid postingId: "${postingId}"` })
        })
    })
  })

  describe('derStandard server errors', () => {
    const postingId = 1034153378
    const emptyResult = { postingId: String(postingId), rating: { neg: [], pos: [] } }

    it('no result', () => {
      nockPostingRating(postingId).reply(200, testRating('no_result'))
      return requestRating(postingId)
        .then(response => { response.should.deep.equal(emptyResult) })
    })

    it('internal error', () => {
      nockPostingRating(postingId).reply(500, 'blub')
      return requestRating(postingId)
        .then(response => { response.should.deep.equal(emptyResult) })
    })
  })
})
