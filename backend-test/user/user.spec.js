const nock = require('nock')
const TestServer = require('../utils/testServer')
const dataLoader = require('../../test-data/testDataLoader')

describe('get userprofile endpoint', () => {
  const server = TestServer()
  const testData = (userId, pageId) => dataLoader.getComment(userId, pageId)
  const expectedData = userId => dataLoader.getCommentResult(userId)

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

  describe('valid requests', () => {
    const runUserProfileTest = (userId, pageCount) => {
      for (var pageNum = 1; pageNum <= pageCount; pageNum++) {
        nock(server.config.dstuHost)
          .get(`/userprofil/postings/${userId}?page=${pageNum}`)
          .reply(200, testData(userId, pageNum))
      }
      return server.request()
        .get(`/dstuapi/userprofile/${userId}`)
        .expect(200, expectedData(userId))
    }

    it('respond with userprofile (#755005 - one page)', () =>
      runUserProfileTest(755005, 1)
    )

    it('respond with userprofile (#425185 - multiple pages)', () =>
      runUserProfileTest(425185, 3)
    )
  })

  describe('invalid requests', () => {
    it('return 400 when no userId in request', () => server.request()
      .get(`/dstuapi/userprofile/`)
      .expect(400, { error: 'User-ID missing' })
    )

    it('return 400 when userId is NaN', () => server.request()
      .get(`/dstuapi/userprofile/123n34`)
      .expect(400, { error: 'User-ID not a number' })
    )
  })
})
