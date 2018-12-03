const url = require('url')
const mockServer = require('mockttp').getLocal()

const configLoader = require('../backend/configLoader')
const dataLoader = require('../test-data/testDataLoader')

const htmlContentHeader = { 'content-type': 'text/html; charset=utf-8' }

const serverCfg = configLoader.get(console)

const start = () => {
  const { port } = url.parse(serverCfg.dstuHost)
  return mockServer.start(Number(port))
}
const stop = () => mockServer.stop()

const pagePath = (userId, pageNum) => {
  const path = serverCfg.userProfileTemplate
    .replace(serverCfg.userIdPlaceholder, userId)
    .replace(serverCfg.pagePlaceholder, pageNum)
  return url.parse(path, true)
}
const serveUserPage = async (userId, pageNum) => {
  const { pathname, query } = pagePath(userId, pageNum)
  const body = dataLoader.getComment(userId, pageNum)
  const mockRule = mockServer.get(pathname)
  for (let param in query) {
    mockRule.withQuery({ [param]: query[param] })
  }
  await mockRule.thenReply(200, body, htmlContentHeader)
}

module.exports = { start, stop, serveUserPage }
