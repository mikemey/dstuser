const nock = require('nock')
const TestServer = require('../utils/testServer')

nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')

describe('get userprofile endpoint', () => {
  const server = TestServer()
  const testData = filename => server.testData(filename)
  const expectedData = filename => server.testDataAsJson(filename)

  before(server.start)
  after(server.stop)

  const getUserProfile = userId => server.request()
    .get(`/dstuapi/userprofile/${userId}`)
  const nockUserProfileRequest = (userId, page) => nock(server.config.dstuHost)
    .get(`/userprofil/postings/${userId}?page=${page}`)

  it('should respond with userprofile (#755005 - one page)', () => {
    const testUserId = 755005
    nockUserProfileRequest(testUserId, 1).reply(200, testData('profile_755005_1.txt'))
    return getUserProfile(testUserId)
      .expect(200)
      .then(({ body }) => {
        body.should.deep.equal(expectedData('profile_755005_result.json'))
      })
  })

  it('should respond with userprofile (#425185 - multiple pages)', () => {
    const testUserId = 425185
    nockUserProfileRequest(testUserId, 1).reply(200, testData('profile_425185_1.txt'))
    nockUserProfileRequest(testUserId, 2).reply(200, testData('profile_425185_2.txt'))
    nockUserProfileRequest(testUserId, 3).reply(200, testData('profile_425185_3.txt'))

    return getUserProfile(testUserId)
      .expect(200)
      .then(({ body }) => {
        body.should.deep.equal(expectedData('profile_425185_result.json'))
      })
  })
})
