const nock = require('nock')
const fs = require('fs')
const path = require('path')
const TestServer = require('../utils/testServer')

nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')

describe('get userprofile endpoint', () => {
  const server = TestServer()
  const testData = filename => fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8')
  const expectedData = filename => require(`./data/${filename}`)

  before(server.start)
  after(server.stop)

  const getUserProfile = userId => server.request()
    .get(`/dstuapi/userprofile/${userId}`)
  const nockUserProfileRequest = userId => nock(server.config.dstuHost)
    .get(`/userprofil/postings/${userId}?page=1`)

  it('should respond with userprofile (#755005 - one page)', () => {
    const testUserId = 755005
    nockUserProfileRequest(testUserId)
      .reply(200, testData('profile_755005_1.html'))
    return getUserProfile(testUserId)
      .expect(200)
      .then(({ body }) => {
        body.should.deep.equal(expectedData('profile_755005_result.json'))
      })
  })
})
