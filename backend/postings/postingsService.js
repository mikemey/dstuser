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
        const collector = Collector(pageParser, prBuilder.build, onPartialResult)

        return sendPageResult(firstPage, collectPostings, collector)
      })
      .then(() => {
        logger.info(`user profile [${userId}] \tDONE (${stopTimer(profileTimer)}ms)`)
      })
  }

  const Collector = (pageParser, responseBuilder, onPartialResult) => {
    const links = pageParser.getRemainingPageLinks()
    const linksEmpty = () => links.length === 0
    const nextLink = () => links.shift()
    return {
      linksEmpty,
      nextLink,
      responseBuilder,
      onPartialResult,
      getPostings: pageParser.getPostings
    }
  }

  const sendPageResult = (page, nextFunc, collector) => {
    const postings = collector.getPostings(page)
    return sendPartialResult(postings, nextFunc, collector)
  }

  const sendPartialResult = (postings, nextFunc, collector) => {
    return collector.onPartialResult(collector.responseBuilder(postings))
      ? nextFunc(collector)
      : Promise.resolve()
  }

  const collectPostings = collector => collector.linksEmpty()
    ? Promise.resolve()
    : requestPage(collector.nextLink())
      .then(page => sendPageResult(page, collectPostings, collector))
      .catch(error => {
        logger.error(`Error requesting page`, error)
        return sendPartialResult([], collectPostings, collector)
      })

  const requestPage = url => {
    logger.info(`postings: ${url}`)
    const pageTimer = startTimer()
    return requests.getHtml(url)
      .then(result => {
        logger.info(`postings: ${url} \tDONE (${stopTimer(pageTimer)}ms)`)
        return result
      })
  }

  return {
    loadPostings
  }
}

module.exports = PostingsService
