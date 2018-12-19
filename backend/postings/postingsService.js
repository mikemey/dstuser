const UserPageObject = require('./userPageObject')
const requests = require('../utils/requests')
const { startTimer, stopTimer } = require('../utils/msTimer')

const PostingsService = (config, logger) => {
  const profileTemplate = config.dstuHost + config.userProfileTemplate
  const userIdPlaceholder = config.userIdPlaceholder
  const pagePlaceholder = config.pagePlaceholder

  const loadPostings = userId => {
    logger.info(`user profile [${userId}]`)
    const profileTimer = startTimer()

    const profileUrl = profileTemplate
      .replace(userIdPlaceholder, userId)
      .replace(pagePlaceholder, 1)

    return requestPage(profileUrl)
      .then(firstPage => {
        const userPage = UserPageObject.from(firstPage, config)
        const userName = userPage.getUserName()
        const firstPagePostings = userPage.getPostings()
        return Promise.all(userPage.findRemainingLinks()
          .map(link => requestPage(link).then(extractPostings))
        ).then(remainingPostings => {
          const postings = [].concat.apply(firstPagePostings, remainingPostings)
          logger.info(`user profile ${userId} \tDONE (${stopTimer(profileTimer)}ms)`)
          return { userName, postings }
        })
      })
  }

  const requestPage = url => {
    logger.info(`postings: ${url}`)
    const pageTimer = startTimer()
    return requests.getHtml(url)
      .then(result => {
        logger.info(`postings: ${url} \tDONE (${stopTimer(pageTimer)}ms)`)
        return result
      })
  }
  const extractPostings = page => UserPageObject.from(page, config).getPostings()

  return {
    loadPostings
  }
}

module.exports = PostingsService
