const express = require('express')

const RatingService = require('./ratingService')

const createRatingRouter = (config, logger) => {
  const router = express.Router()
  const ratingService = RatingService(config, logger)

  const clientIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress

  router.ws('/rating/:pid', (ws, req) => {
    const postingId = req.params.pid
    logger.info(`received rating request from: [${clientIp(req)}], for: [${postingId}]`)
    const pid = Number(postingId)
    return isNaN(pid)
      ? invalidPostingIdResponse(ws, postingId)
      : ratingService.loadRating(pid)
        .then(rating => ws.send(JSON.stringify({ postingId, rating })))
        .finally(() => {
          logger.info(`closing connection to: [${clientIp(req)}]`)
          ws.close()
        })
  })

  const invalidPostingIdResponse = (ws, postingId) => {
    ws.send(JSON.stringify(errorMessage(`invalid postingId: "${postingId}"`)))
    ws.close()
  }

  const errorMessage = error => { return { error } }

  return router
}

module.exports = createRatingRouter
