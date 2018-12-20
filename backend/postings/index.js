const express = require('express')

const { isNumber, clientIp } = require('../utils/endpointHelper')
const PostingsService = require('./postingsService')

const createPostingsRouter = (config, logger) => {
  const router = express.Router()
  const postingsService = PostingsService(config, logger)

  router.ws('/postings/:userId', (ws, req) => {
    const userId = req.params.userId
    logger.info(`received postings request: [${clientIp(req)}], userId: [${userId}]`)
    ws.isOpen = true
    return isNumber(ws, userId)
      .then(loadPostings(ws))
      .catch(errorHandler(ws, userId))
      .finally(() => {
        logger.info(`terminating connection: [${clientIp(req)}]`)
        ws.terminate()
      })
  })

  const loadPostings = ws => userId => {
    const onPartialResult = partial => {
      saveSend(ws, partial)
      return ws.isOpen
    }
    return postingsService.loadPostings(userId, onPartialResult)
  }

  const errorHandler = (ws, userId) => error => {
    const message = `User ID not found: ${userId}`
    logger.error(message, error)
    return saveSend(ws, { error: message })
  }

  const saveSend = (ws, message) => {
    const messageStr = JSON.stringify(message)
    try {
      ws.send(messageStr)
    } catch (error) {
      ws.isOpen = false
      logger.info('client closed connection.')
    }
  }

  return router
}

module.exports = createPostingsRouter
