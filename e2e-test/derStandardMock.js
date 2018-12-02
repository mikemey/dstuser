const url = require('url')
const querystring = require('querystring')
const MockHttpServer = require('mock-http-server')

const configLoader = require('../backend/configLoader')
const dataLoader = require('../test-data/testDataLoader')

const htmlContentHeader = { 'content-type': 'text/html; charset=utf-8' }

const DerStandardMock = () => {
  const serverConfig = configLoader.get(console)
  const { hostname, port } = url.parse(serverConfig.dstuHost)
  const server = new MockHttpServer({ host: hostname, port })

  const pagePath = (userId, pageNum) => {
    const pathString = serverConfig.userProfileTemplate
      .replace(serverConfig.userIdPlaceholder, userId)
      .replace(serverConfig.pagePlaceholder, pageNum)
    return url.parse(pathString, true)
  }

  const serveUserPage = (userId, pageNum) => {
    const { pathname, query } = pagePath(userId, pageNum)
    const body = dataLoader.getComment(userId, pageNum)

    server.on({
      path: pathname,
      filter: req => req.pathname === pathname &&
        querystring.stringify(req.query) === querystring.stringify(query),
      reply: {
        status: 200,
        headers: htmlContentHeader,
        body
      }
    })
  }

  return {
    start: server.start,
    stop: server.stop,
    serveUserPage
  }
}

module.exports = DerStandardMock
