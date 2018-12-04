const rp = require('request-promise')
const cheerio = require('cheerio')

const htmlTransformOpts = (url, method = 'GET') => Object.assign(
  { uri: url },
  { method },
  { followRedirect: false },
  { transform: body => cheerio.load(body) }
)

const getHtml = url => rp(htmlTransformOpts(url))

module.exports = {
  getHtml
}
