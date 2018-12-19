const express = require('express')

const RatingService = require('./ratingService')
const isNumberCheck = require('../utils/isNumberCheck')

const createRatingRouter = (config, logger) => {
  const router = express.Router()
  const ratingService = RatingService(config, logger)

  router.ws('/rating/:pid', (ws, req) => {
    const postingId = req.params.pid
    logger.info(`received rating request from: [${clientIp(req)}], for: [${postingId}]`)
    return isNumberCheck(ws, postingId)
      .then(pid => ratingService.loadRating(pid))
      .then(rating => ws.send(JSON.stringify(rating)))
      .catch(err => { logger.info(`Error: ${err.message}`) })
      .finally(() => {
        logger.info(`closing connection to: [${clientIp(req)}]`)
        ws.close()
      })
  })

  const clientIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress

  return router
}

module.exports = createRatingRouter
