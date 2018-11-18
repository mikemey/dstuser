const express = require('express')

const createUserRouter = logger => {
  const router = express.Router()

  router.get('/userprofile', (req, res) => {
    res.send('hello')
  })

  return router
}

module.exports = createUserRouter
