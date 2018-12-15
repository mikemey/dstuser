const url = require('url')
const mockServer = require('mockttp').getLocal()

const configLoader = require('../backend/configLoader')
const TestDataLoader = require('../test-data/testDataLoader')

const htmlContentHeader = { 'content-type': 'text/html; charset=utf-8' }

const serverCfg = configLoader.get(console)
const dataLoader = TestDataLoader(serverCfg.dstuHost)

let serverUrl
const start = async () => {
  serverUrl = `http://localhost:${serverCfg.port}`
  const { port } = url.parse(serverCfg.dstuHost)
  await mockServer.start(Number(port))
}

const getServerUrl = path => serverUrl ? `${serverUrl}${path}` : '-- not yet started --'

const stop = async () => { await mockServer.stop() }

const pagePath = (userId, pageNum) => serverCfg.userProfileTemplate
  .replace(serverCfg.userIdPlaceholder, userId)
  .replace(serverCfg.pagePlaceholder, pageNum)

const ratingPath = postingId => serverCfg.postingRatingTemplate
  .replace(serverCfg.postingIdPlaceholder, postingId)

const serveUserPageFor = async (userId, pageNum) => {
  const body = dataLoader.getComment(userId, pageNum)
  await mockWithQuery(pagePath(userId, pageNum)).thenReply(200, body, htmlContentHeader)
}

const server404WhenUserPageFor = async userId => {
  await mockWithQuery(pagePath(userId, 1))
    .thenReply(404, dataLoader.get404Page())
}

const getCommentResult = userId => dataLoader.getCommentResult(userId)

const serveRating = async (userId, postingId) => {
  const body = dataLoader.getRating(userId, postingId)
  await mockWithQuery(ratingPath(postingId)).thenReply(200, body, htmlContentHeader)
}

const mockWithQuery = fullPath => {
  const { pathname, query } = url.parse(fullPath, true)
  const mockRule = mockServer.get(pathname)
  for (let param in query) {
    mockRule.withQuery({ [param]: query[param] })
  }
  return mockRule
}

/* eslint object-property-newline: "off" */
module.exports = {
  start, stop, getServerUrl,
  serveUserPageFor, server404WhenUserPageFor, getCommentResult,
  serveRating
}
