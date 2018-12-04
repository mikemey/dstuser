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

  const nockDstUserprofile = (userId, pageNum) => nock(server.config.dstuHost)
    .get(`/userprofil/postings/${userId}?page=${pageNum}`)

  const requestUserprofile = userId => server.request()
    .get(`/dstuapi/userprofile/${userId}`)

  describe('valid requests', () => {
    it('respond with userprofile (#755005 - one page)', () =>
      runUserProfileTest(755005, 1)
    )

    it('respond with userprofile (#425185 - multiple pages)', () =>
      runUserProfileTest(425185, 3)
    )

    const runUserProfileTest = (userId, pageCount) => {
      for (var pageNum = 1; pageNum <= pageCount; pageNum++) {
        nockDstUserprofile(userId, pageNum).reply(200, testData(userId, pageNum))
      }
      return requestUserprofile(userId).expect(200, expectedData(userId))
    }
  })

  describe('invalid requests', () => {
    it('return 400 when no userId in request', () =>
      requestUserprofile('').expect(400, { error: 'User ID missing' })
    )

    it('return 400 when userId is NaN', () =>
      requestUserprofile('123n34').expect(400, { error: 'User ID not a number: 123n34' })
    )
  })
})
