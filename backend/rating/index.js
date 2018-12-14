const express = require('express')

const createRatingRouter = (config, logger) => {
  const router = express.Router()

  logger.info('createRatingRouter')
  router.ws('/echo', ws => {
    // logger.info('received echo request: ' + req.url)
    ws.on('message', msg => {
      ws.send(`echo: ${msg}`)
      ws.close()
    })
  })

  return router
}

module.exports = createRatingRouter
