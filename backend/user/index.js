const express = require('express')

const { isNumber, clientIp } = require('../utils/endpointHelper')
const UserService = require('./userService')

const createUserRouter = (config, logger) => {
  const router = express.Router()
  const userService = UserService(config, logger)

  router.get('/userprofile/:userId?', (req, res) => {
    const { userId, error } = extractUserId(req)
    if (error) {
      logger.error(`Invalid userprofile request: ${userId}`)
      return res.status(400).json({ error })
    }
    return userService
      .loadPostings(userId)
      .then(postings => res.json(postings))
      .catch(errorHandler(res, userId))
  })

  const extractUserId = req => {
    const reqUserId = req.params.userId
    if (!reqUserId) return result(reqUserId, 'User ID missing')

    const parsed = Number(reqUserId)
    return isNaN(parsed)
      ? result(reqUserId, `User ID not a number: ${reqUserId}`)
      : result(parsed, null)
  }

  const result = (userId, error) => ({ userId, error })

  const errorHandler = (res, userId) => error => {
    const message = `User ID not found: ${userId}`
    logger.error(message, error)
    return res.status(404).json({ error: message })
  }

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

module.exports = createUserRouter
