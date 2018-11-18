const fs = require('fs')

const config = JSON.parse(fs.readFileSync('dstu.config.json', 'utf8'))

module.exports = config
