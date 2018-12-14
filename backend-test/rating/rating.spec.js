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
    nock.cleanAll()
    nock.enableNetConnect()
    return server.stop()
  })

  const testRating = postingId => dataLoader.getRating(userId, postingId)
  const expectedData = postingId => dataLoader.getRatingResult(userId, postingId)

  const postingRatingUrl = postId => testConfig.postingRatingTemplate
    .replace(testConfig.postingIdPlaceholder, postId)

  const nockPostingRating = postingId => nock(testConfig.dstuHost).get(postingRatingUrl(postingId))
  // "https://derstandard.at/forum/ratinglog?id=$POSTID$&idType=1"  -H 'X-Requested-With: XMLHttpRequest'

  // const requestPostingRating = postingId => server.request()
  //   .get(postingRatingUrl(postingId))

  describe('request posting ratings', () => {
    it('responds with only positive ratings', () => runRatingsTest(1036279475))

    it('responds with only negative ratings', () => runRatingsTest(1034368216))

    it('responds with positive and negative ratings', () => runRatingsTest(1034153378))

    const runRatingsTest = postingId => {
      nockPostingRating(postingId).reply(200, testRating(postingId))
      return server.ws('/dstuws/rating').onMessage(postingId)
        .then(response => {
          response.should.deep.equal(expectedData(postingId))
        })
    }
  })

  describe('invalid requests', () => {
    it('no message received', () => { })
    it('NaN received', () => { })
    it('space padded number received', () => { })
  })

  describe('derStandard server errors', () => {
  })
})
