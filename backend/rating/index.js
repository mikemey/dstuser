const express = require('express')

const RatingService = require('./ratingService')
const { isNumber, clientIp } = require('../utils/endpointHelper')

const createRatingRouter = (config, logger) => {
  const router = express.Router()
  const ratingService = RatingService(config, logger)

  router.ws('/rating/:pid', (ws, req) => {
    const postingId = req.params.pid
    logger.info(`received rating request from: [${clientIp(req)}], for: [${postingId}]`)
    return isNumber(ws, postingId)
      .then(pid => ratingService.loadRating(pid))
      .then(rating => ws.send(JSON.stringify(rating)))
      .catch(err => { logger.info(`Error: ${err.message}`) })
      .finally(() => {
        logger.info(`closing connection to: [${clientIp(req)}]`)
        ws.close()
      })
  })

  return router
}

module.exports = createRatingRouter
