const $ = require('cheerio')
const requests = require('../utils/requests')

const RatingService = (config, logger) => {
  const postingTemplate = config.dstuHost + config.postingRatingTemplate
  const postingIdPlaceholder = config.postingIdPlaceholder

  const cleanText = el => el.text().trim()

  const loadRating = postingId => {
    const postingUrl = postingTemplate
      .replace(postingIdPlaceholder, postingId)

    logger.info(`posting rating [${postingId}]`)
    return requests.getHtml(postingUrl)
      .then(extractAllRatings)
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
