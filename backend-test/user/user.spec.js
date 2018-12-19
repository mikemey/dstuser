const nock = require('nock')
const TestServer = require('../utils/testServer')
const TestDataLoader = require('../../test-data/testDataLoader')

describe('postings websocket', () => {
  const server = TestServer()
  const dataLoader = TestDataLoader(server.config.dstuHost)

  const testData = (userId, pageId) => dataLoader.getComment(userId, pageId)
  const expectedData = userId => dataLoader.getCommentResult(userId)

  const nockDstUserprofile = (userId, pageNum) => nock(server.config.dstuHost)
    .get(`/userprofil/postings/${userId}?pageNumber=${pageNum}&sortMode=1`)

  const requestPostings = userId => server.ws(`/dstu/ws/postings/${userId}`)

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
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data[0].should.deep.equal(expectedData(userId))
      })
    }
  })

  describe('invalid requests', () => {
    it('when userId is NaN', () => requestPostings('123n34').then(response => {
      response.status.should.equal('closed')
      response.data[0].should.deep.equal({ error: `NaN: "123n34"` })
    }))
  })

  describe('derStandard server errors', () => {
    const userId = 425185
    const errorResponse = { error: `User ID not found: ${userId}` }

    it('respond with error message when 404', () => {
      nockDstUserprofile(userId, 1).reply(404, dataLoader.get404Page())
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data[0].should.deep.equal(errorResponse)
      })
    })

    it('respond with error message when 404 with multiple pages', () => {
      nockDstUserprofile(userId, 1).reply(200, testData(userId, 1))
      nockDstUserprofile(userId, 2).reply(200, testData(userId, 2))
      nockDstUserprofile(userId, 3).reply(404, dataLoader.get404Page())
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data[0].should.deep.equal(errorResponse)
      })
    })

    it('respond with error message when 302', () => {
      const fakeErrorUrl = '/error/notfoundpage'
      nockDstUserprofile(userId, 1).reply(302, dataLoader.get302Page(), {
        'Location': fakeErrorUrl
      })
      const scope = nock(server.config.dstuHost).get(fakeErrorUrl).reply(200, 'this shouldnt happen')
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data[0].should.deep.equal(errorResponse)
      }).then(() => { scope.isDone().should.equal(false) })
    })
  })
})
