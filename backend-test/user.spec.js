const TestServer = require('./utils/testServer')

describe('GET /dstuapi/userprofile endpoint', () => {
  const server = TestServer()

  before(server.start)

  after(server.stop)

  const getUserProfile = () => server.request().get('/dstuapi/userprofile')

  it('should respond hello', () => getUserProfile()
    .expect(200)
    .then(({ text }) => {
      text.should.equal('hello')
    })
  )
})
