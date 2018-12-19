const express = require('express')

const { isNumber, clientIp } = require('../utils/endpointHelper')
const UserService = require('./userService')

const createPostingsRouter = (config, logger) => {
  const router = express.Router()
  const userService = UserService(config, logger)

  router.ws('/postings/:userId', (ws, req) => {
    const userId = req.params.userId
    logger.info(`received postings request from: [${clientIp(req)}], for: [${userId}]`)
    return isNumber(ws, userId)
      .then(userId => userService.loadPostings(userId))
      .then(postings => ws.send(JSON.stringify(postings)))
      .catch(wsErrorHandler(ws, userId))
      .finally(() => {
        logger.info(`closing connection to: [${clientIp(req)}]`)
        ws.close()
      })
  })

  const wsErrorHandler = (ws, userId) => error => {
    const message = `User ID not found: ${userId}`
    logger.error(message, error)
    return ws.send(JSON.stringify({ error: message }))
  }

  return router
}

module.exports = createPostingsRouter
