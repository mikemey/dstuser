const nock = require('nock')
const TestServer = require('../utils/testServer')
const TestDataLoader = require('../../test-data/testDataLoader')

xdescribe('ratings websocket', () => {
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

  describe('request posting ratings', () => {
    it('responds with only positive ratings', () => {
      const postingId = 1036279475
      nockPostingRating(postingId).reply(200, testRating(postingId))
    })
  })

  describe('invalid requests', () => {
  })

  describe('derStandard server errors', () => {
  })
})
