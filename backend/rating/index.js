const express = require('express')

const RatingService = require('./ratingService')

const createRatingRouter = (config, logger) => {
  const router = express.Router()
  const ratingService = RatingService(config, logger)

  router.ws('/rating/:pid', (ws, req) => {
    const postingId = req.params.pid
    logger.info(`received rating request from: [${clientIp(req)}], for: [${postingId}]`)
    return checkInputParameter(ws, req, postingId)
      .then(pid => ratingService.loadRating(pid))
      .then(rating => ws.send(JSON.stringify(rating)))
      .catch(err => { logger.info(`Error: ${err.message}`) })
      .finally(() => {
        logger.info(`closing connection to: [${clientIp(req)}]`)
        ws.close()
      })
  })

  const checkInputParameter = (ws, req, param) => new Promise((resolve, reject) => {
    const pid = Number(param)
    if (isNaN(pid)) {
      const msg = `NaN: "${param}"`
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
