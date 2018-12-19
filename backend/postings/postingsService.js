const UserPageObject = require('./userPageObject')
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
        const userPage = UserPageObject.from(firstPage, config)
        const userName = userPage.getUserName()
        const remainingPageLinks = userPage.findRemainingLinks()

        const prBuilder = PartialResultBuilder(userName, remainingPageLinks.length + 1)
        const firstPagePostings = userPage.getPostings()
        onPartialResult(prBuilder.build(firstPagePostings))

        return collectPostings(remainingPageLinks, prBuilder, onPartialResult)
      })
      .then(() => {
        logger.info(`user profile [${userId}] \tDONE (${stopTimer(profileTimer)}ms)`)
      })
  }

  const collectPostings = (remainingPageLinks, prBuilder, onPartialResult) => remainingPageLinks.length === 0
    ? Promise.resolve()
    : requestPage(remainingPageLinks.shift())
      .then(page => {
        const postings = UserPageObject.from(page, config).getPostings()
        onPartialResult(prBuilder.build(postings))
        return collectPostings(remainingPageLinks, prBuilder, onPartialResult)
      })
      .catch(error => {
        logger.error(`Error requesting page`, error)
        onPartialResult(prBuilder.build([]))
      })
      .finally(() => collectPostings(remainingPageLinks, prBuilder, onPartialResult))

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
