const nock = require('nock')
const TestServer = require('../utils/testServer')
const TestDataLoader = require('../../test-data/testDataLoader')

describe('postings websocket', () => {
  const server = TestServer()
  const dataLoader = TestDataLoader(server.config.dstuHost)

  const testData = (userId, pageId = 1) => dataLoader.getComment(userId, pageId)
  const expectedData = userId => dataLoader.getCommentResult(userId)

  const nockUserProfile = (userId, pageNum) => nock(server.config.dstuHost)
    .get(`/userprofil/postings/${userId}?pageNumber=${pageNum}&sortMode=1`)

  const nockDefaultUserProfile = userId => {
    const postingsPathRe = new RegExp(`\\/userprofil\\/postings\\/${userId}.*`)
    return nock(server.config.dstuHost).persist()
      .get(postingsPathRe)
  }

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
        nockUserProfile(userId, pageNum).reply(200, testData(userId, pageNum))
      }
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data.should.deep.equal(expectedData(userId))
      })
    }

    it('respond with userprofile (#799725 - large amount of pages)', () => {
      const userId = 799725
      nockDefaultUserProfile(userId).reply(200, testData(userId))
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data.should.have.length(11)
        response.data[0].totalParts.should.equal(11)
        response.data[0].totalPostings.should.equal(1010)
      })
    }).timeout(5000)
  })

  describe('invalid requests', () => {
    it('when userId is NaN', () => requestPostings('123n34').then(response => {
      response.status.should.equal('closed')
      response.data[0].should.deep.equal({ error: `NaN: "123n34"` })
    }))
  })

  describe('client closes connections', () => {
    const userId = 799725
    const delay = time => result => new Promise(resolve => setTimeout(() => resolve(result), time))

    it('should stop requesting user pages', () => {
      let requestCounter = 0
      nockDefaultUserProfile(userId).reply(() => {
        requestCounter += 1
        return [200, testData(userId)]
      })

      const onMessage = websocket => websocket.close()

      return server.ws(`/dstu/ws/postings/${userId}`, onMessage)
        .then(response => {
          response.status.should.equal('closed')
          response.data.should.have.lengthOf(1)
          response.data[0].part.should.equal(1)
          response.data[0].totalParts.should.equal(11)
          response.data[0].userName.should.equal('Helmut Wolff')
        })
        .then(delay(50))
        .then(() => {
          // first user page + first bucket (= 10 user pages per bucket)
          requestCounter.should.equal(11)
        })
    })
  })

  describe('derStandard server errors', () => {
    const userId = 425185
    const errorResponse = { error: `User ID not found: ${userId}` }

    it('respond with error message when 404', () => {
      nockUserProfile(userId, 1).reply(404, dataLoader.get404Page())
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data[0].should.deep.equal(errorResponse)
      })
    })

    it('respond with empty result when 404 on user pages', () => {
      nockUserProfile(userId, 1).reply(200, testData(userId, 1))
      nockUserProfile(userId, 2).reply(200, testData(userId, 2))
      nockUserProfile(userId, 3).reply(404, dataLoader.get404Page())

      const partialResult = expectedData(userId)
      partialResult[1].postings.splice(10) // only first part of response part
      return requestPostings(userId).then(response => {
        response.status.should.equal('closed')
        response.data.should.deep.equal(partialResult)
      })
    })

    it('respond with error message when 302', () => {
      const fakeErrorUrl = '/error/notfoundpage'
      nockUserProfile(userId, 1).reply(302, dataLoader.get302Page(), {
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
