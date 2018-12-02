const nock = require('nock')
const TestServer = require('../utils/testServer')
const dataLoader = require('../../test-data/testDataLoader')

nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')

describe('get userprofile endpoint', () => {
  const server = TestServer()
  const testData = (userId, pageId) => dataLoader.getComment(userId, pageId)
  const expectedData = userId => dataLoader.getCommentResult(userId)

  before(server.start)
  after(server.stop)

  const runUserProfileTest = (userId, pageCount) => {
    for (var pageNum = 1; pageNum <= pageCount; pageNum++) {
      nock(server.config.dstuHost)
        .get(`/userprofil/postings/${userId}?page=${pageNum}`)
        .reply(200, testData(userId, pageNum))
    }
    return server.request()
      .get(`/dstuapi/userprofile/${userId}`)
      .expect(200)
      .then(({ body }) => {
        body.should.deep.equal(expectedData(userId))
      })
  }
  it('should respond with userprofile (#755005 - one page)', () =>
    runUserProfileTest(755005, 1)
  )

  it('should respond with userprofile (#425185 - multiple pages)', () =>
    runUserProfileTest(425185, 3)
  )
})
