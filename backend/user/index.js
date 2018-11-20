const express = require('express')

const UserService = require('./userService')

const createUserRouter = (config, logger) => {
  const router = express.Router()
  const userService = UserService(config, logger)

  router.get('/userprofile/:userId', (req, res) => userService
    .loadPostings(req.params.userId)
    .then(postings => res.json(postings))
  )

  return router
}

module.exports = createUserRouter
