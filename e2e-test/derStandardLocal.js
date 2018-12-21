const express = require('express')
const url = require('url')

const configLoader = require('../backend/configLoader')
const TestDataLoader = require('../test-data/testDataLoader')

const logformat = '\x1b[32m[DST] %s\x1b[0m'
const logger = {
  info: msg => console.log(logformat, msg),
  log: obj => console.log(obj),
  error: (msg, err) => {
    console.log(logformat, msg)
    if (err) console.log(err.stack)
  }
}

const config = configLoader.get(logger)
const { port } = url.parse(config.dstuHost)
const dataLoader = TestDataLoader(config.dstuHost)

const shutdown = () => {
  logger.info('STOP')
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

const app = express()

const manyPagesUserId = 799725
const ratingUserId = 755005

app.use('/userprofil/postings/:userId', (req, res) => {
  const userId = req.params.userId
  const page = Number(userId) === manyPagesUserId
    ? 1
    : req.query.pageNumber
  logger.info(`requested user page ${userId}-${page}`)
  return res.status(200).send(dataLoader.getComment(userId, page))
})

app.use('/forum/ratinglog', (req, res) => {
  const idType = req.query.idType
  const postingId = idType === '1' ? req.query.id : `${req.query.id}_ext`

  logger.info(`requested rating for ${postingId}`)
  return res.status(200).send(dataLoader.getRating(ratingUserId, postingId))
})

const server = app.listen(port, () => {
  logger.info(`Started on port ${server.address().port}`)
})

server.once('error', err => {
  logger.error(`server error: ${err.message}`, err)
})
