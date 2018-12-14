const rp = require('request-promise')
const cheerio = require('cheerio')

const htmlTransformOpts = (url, headers = null, method = 'GET') => Object.assign(
  { uri: url },
  { method },
  { followRedirect: false },
  { transform: body => cheerio.load(body) },
  headers ? { headers } : {}
)

const getHtml = (url, headers) => rp(htmlTransformOpts(url, headers))

module.exports = {
  getHtml
}
