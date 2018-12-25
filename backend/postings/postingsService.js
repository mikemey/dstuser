const UserPageParser = require('./userPageParser')
const PartialResultBuilder = require('./partialResultBuilder')

const requests = require('../utils/requests')
const { startTimer, stopTimer } = require('../utils/msTimer')

const PostingsService = (config, logger) => {
  const profileTemplate = config.dstuHost + config.userProfileTemplate
  const userIdPlaceholder = config.userIdPlaceholder
  const pagePlaceholder = config.pagePlaceholder

  const loadPostings = (userId, onPartialResult) => {
    logger.info(`user profile [${userId}]`)
    const profileTimer = startTimer()

    const profileUrl = profileTemplate
      .replace(userIdPlaceholder, userId)
      .replace(pagePlaceholder, 1)

    return requestPage(profileUrl)
      .then(firstPage => {
        const pageParser = UserPageParser.from(firstPage, config)
        const commonProps = pageParser.getCommonProps()
        const prBuilder = PartialResultBuilder(commonProps)
        const firstPagePostings = pageParser.getPostings(firstPage)

        const firstPromise = Promise.resolve(onPartialResult(prBuilder.build(firstPagePostings)))
        const links = pageParser.getRemainingPageLinks()
        const reqSendPostings = requestAndSendPostings(pageParser.getPostings, prBuilder.build, onPartialResult)

        return links.reduce((prom, link) => prom.then(keepGoing =>
          keepGoing ? reqSendPostings(link) : Promise.resolve(false)
        ), firstPromise)
      })
      .then(() => {
        logger.info(`user profile [${userId}] DONE (total: ${stopTimer(profileTimer)}ms)`)
      })
  }

  const requestAndSendPostings = (parsePostings, responseBuilder, onPartialResult) => url => {
    const receiveSendCycleTimer = startTimer()
    return requests.getHtml(url)
      .then(parsePostings)
      .catch(error => {
        logger.error(`Error requesting page: ${url}`, error)
        return []
      })
      .then(postings => onPartialResult(responseBuilder(postings)))
      .then(result => {
        logger.info(`postings: ${url} DONE (R+S: ${stopTimer(receiveSendCycleTimer)}ms)`)
        return result
      })
  }

  const requestPage = url => {
    logger.info(`postings: ${url}`)
    const requestTimer = startTimer()
    return requests.getHtml(url)
      .then(result => {
        logger.info(`postings: ${url} (req: ${stopTimer(requestTimer)}ms)`)
        return result
      })
  }

  return {
    loadPostings
  }
}

module.exports = PostingsService
