const express = require('express')

const RatingService = require('./ratingService')

const createRatingRouter = (config, logger) => {
  const router = express.Router()
  const ratingService = RatingService(config, logger)

  router.ws('/rating/:pid', (ws, req) => checkPostingId(ws, req)
    .then(pid => ratingService.loadRating(pid))
    .then(rating => ws.send(JSON.stringify(rating)))
    .catch(err => { logger.info(`Error: ${err.message}`) })
    .finally(() => {
      logger.info(`closing connection to: [${clientIp(req)}]`)
      ws.close()
    })
  )

  const checkPostingId = (ws, req) => new Promise((resolve, reject) => {
    const postingId = req.params.pid
    logger.info(`received rating request from: [${clientIp(req)}], for: [${postingId}]`)
    const pid = Number(postingId)
    if (isNaN(pid)) {
      const msg = `invalid postingId: "${postingId}"`
      ws.send(JSON.stringify(errorMessage(msg)))
      reject(Error(msg))
    } else {
      resolve(pid)
    }
  })

  const clientIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress

  const errorMessage = error => { return { error } }

  return router
}

module.exports = createRatingRouter
