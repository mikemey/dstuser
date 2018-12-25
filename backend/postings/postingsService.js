const UserPageParser = require('./userPageParser')
const PartialResultBuilder = require('./partialResultBuilder')

const requests = require('../utils/requests')
const { startTimer, stopTimer } = require('../utils/msTimer')

const USERPAGES_PER_PARTITION = 10

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
        const prBuilder = PartialResultBuilder(commonProps(pageParser))
        const firstPagePostings = pageParser.getPostings(firstPage)

        const linkBuckets = createBuckets(pageParser.getRemainingPageLinks())
        const bucketRequest = createBucketRequest(pageParser, prBuilder.build, onPartialResult)
        const firstPromise = Promise.resolve(onPartialResult(prBuilder.build(firstPagePostings)))

        return linkBuckets.reduce((prom, linkBucket) => prom.then(keepGoing => keepGoing
          ? bucketRequest(linkBucket)
          : Promise.resolve(false)
        ), firstPromise)
      })
      .then(() => {
        logger.info(`user profile [${userId}] DONE (total: ${stopTimer(profileTimer)}ms)`)
      })
  }

  const commonProps = pageParser => {
    const userName = pageParser.getUserName()
    const totalParts = 1 + Math.ceil(pageParser.getRemainingPageLinks().length / USERPAGES_PER_PARTITION)
    const totalPostings = pageParser.getTotalPostings()
    return { userName, totalParts, totalPostings }
  }

  const createBuckets = links => links.reduce((buckets, _, ix, arr) => {
    if (ix % USERPAGES_PER_PARTITION === 0) {
      buckets.push(arr.slice(ix, ix + USERPAGES_PER_PARTITION))
    }
    return buckets
  }, [])

  const createBucketRequest = (pageParser, responseBuilder, onPartialResult) => links => {
    const bucketTimer = startTimer()
    return Promise
      .all(links.map(requestAndParsePage(pageParser)))
      .then(postingsBucket => {
        const allPostings = [].concat.apply([], postingsBucket)
        return onPartialResult(responseBuilder(allPostings))
      })
      .then(result => {
        logger.info(`bucket DONE (R+P: ${stopTimer(bucketTimer)}ms)`)
        return result
      })
  }

  const requestAndParsePage = pageParser => url => requestPage(url)
    .then(pageParser.getPostings)
    .catch(error => {
      logger.error(`Error requesting page: ${url}`, error)
      return []
    })

  const requestPage = url => {
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
