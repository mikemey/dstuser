const express = require('express')

const RatingService = require('./ratingService')

const createRatingRouter = (config, logger) => {
  const router = express.Router()
  const ratingService = RatingService(config, logger)

  const clientIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress

  router.ws('/rating', (ws, req) => {
    logger.info(`received rating request from: [${clientIp(req)}]`)
    ws.on('message', postingId => {
      const pid = Number(postingId)
      return ratingService.loadRating(pid)
        .then(rating => ws.send(JSON.stringify({ postingId, rating })))
        .finally(() => {
          logger.info(`closing connection to: [${clientIp(req)}]`)
          ws.close()
        })
    })
  })

  return router
}

module.exports = createRatingRouter
