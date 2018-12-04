const express = require('express')

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

  return router
}

module.exports = createUserRouter
