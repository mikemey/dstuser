const url = require('url')
const mockServer = require('mockttp').getLocal()

const configLoader = require('../backend/configLoader')
const TestDataLoader = require('../test-data/testDataLoader')

const htmlContentHeader = { 'content-type': 'text/html; charset=utf-8' }

const serverCfg = configLoader.get(console)
const dataLoader = TestDataLoader(serverCfg.dstuHost)

const start = async () => {
  const { port } = url.parse(serverCfg.dstuHost)
  await mockServer.start(Number(port))
}

const stop = async () => { await mockServer.stop() }

const pagePath = (userId, pageNum) => {
  const path = serverCfg.userProfileTemplate
    .replace(serverCfg.userIdPlaceholder, userId)
    .replace(serverCfg.pagePlaceholder, pageNum)
  return url.parse(path, true)
}

const serveUserPageFor = async (userId, pageNum) => {
  const { pathname, query } = pagePath(userId, pageNum)
  const body = dataLoader.getComment(userId, pageNum)
  const mockRule = mockServer.get(pathname)
  for (let param in query) {
    mockRule.withQuery({ [param]: query[param] })
  }
  await mockRule.thenReply(200, body, htmlContentHeader)
}

const server404WhenUserPageFor = async userId => {
  const { pathname } = pagePath(userId, 1)
  await mockServer.get(pathname)
    .thenReply(404, dataLoader.get404Page())
}

const getCommentResult = userId => dataLoader.getCommentResult(userId)

module.exports = { start, stop, serveUserPageFor, server404WhenUserPageFor, getCommentResult }
