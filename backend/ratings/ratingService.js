const $ = require('cheerio')
const requests = require('../utils/requests')

const REQUEST_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest'
}

const EMPTY_RESULT = { pos: [], neg: [] }

const RatingService = (config, logger) => {
  const postingTemplate = config.dstuHost + config.postingRatingTemplate
  const postingIdPlaceholder = config.postingIdPlaceholder
  const postingNextTemplate = config.dstuHost + config.postingRatingNextTemplate
  const latestRaterIdPlaceholder = config.latestRaterIdPlaceholder

  const cleanText = el => el.text().trim()
  const cleanUserId = el => /[^/]*$/.exec(el.attr('href'))[0]

  const loadRating = postingId => {
    logger.info(`posting rating [${postingId}]`)
    const requestRating = (url, collectedRating) => requests.getHtml(url, REQUEST_HEADERS)
      .then(extractAllRatings)
      .then(ratingExtract => {
        collectedRating.pos = collectedRating.pos.concat(ratingExtract.pos)
        collectedRating.neg = collectedRating.neg.concat(ratingExtract.neg)

        if (ratingExtract.latestRaterId) {
          const nextUrl = postingNextTemplate
            .replace(postingIdPlaceholder, postingId)
            .replace(latestRaterIdPlaceholder, ratingExtract.latestRaterId)
          return requestRating(nextUrl, collectedRating)
        }
        return collectedRating
      })
      .catch(error => {
        logger.error(`ERROR posting rating [${postingId}: "${postingUrl}"]`, error)
        return EMPTY_RESULT
      })

    const postingUrl = postingTemplate.replace(postingIdPlaceholder, postingId)
    return requestRating(postingUrl, { pos: [], neg: [] })
  }

  const extractAllRatings = page => Promise.all([
    extractRating('positive', page),
    extractRating('negative', page),
    extractLastRaterId(page)
  ]).then(([pos, neg, latestRaterId]) => {
    return { pos, neg, latestRaterId }
  })

  const extractRating = (rate, page) => page(`li[data-rate="${rate}"] > a`)
    .map((_, anchor) => {
      const name = cleanText($(anchor))
      const userId = cleanUserId($(anchor))
      return { name, userId }
    })
    .get()

  const extractLastRaterId = page => {
    const lastLi = page(`li:last-child`)
    if (lastLi.length > 0) {
      const dataFinished = lastLi.attr('data-finished')
      if (dataFinished !== 'true') {
        return cleanUserId(lastLi.find('a'))
      }
    }
    return null
  }
  return { loadRating }
}

module.exports = RatingService
