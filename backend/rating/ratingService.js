const $ = require('cheerio')
const requests = require('../utils/requests')

const REQUEST_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest'
}

const EMPTY_RESULT = { pos: [], neg: [] }

const RatingService = (config, logger) => {
  const postingTemplate = config.dstuHost + config.postingRatingTemplate
  const postingIdPlaceholder = config.postingIdPlaceholder

  const cleanText = el => el.text().trim()

  const loadRating = postingId => {
    const postingUrl = postingTemplate
      .replace(postingIdPlaceholder, postingId)

    logger.info(`posting rating [${postingId}]`)
    return requests.getHtml(postingUrl, REQUEST_HEADERS)
      .then(extractAllRatings)
      .catch(error => {
        logger.error(`ERROR posting rating [${postingId}: "${postingUrl}"]`, error)
        return EMPTY_RESULT
      })
  }

  const extractAllRatings = page => Promise.all([
    extractRating('positive', page),
    extractRating('negative', page)
  ]).then(([pos, neg]) => {
    return { pos, neg }
  })

  const extractRating = (rate, page) => page(`li[data-rate="${rate}"] > a > span`)
    .map((_, span) => cleanText($(span)))
    .get()

  return { loadRating }
}

module.exports = RatingService
