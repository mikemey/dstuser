const $ = require('cheerio')
const requests = require('../utils/requests')

const UserService = (config, logger) => {
  const profileTemplate = config.dstuHost + config.userProfileTemplate
  const userIdPlaceholder = config.userIdPlaceholder
  const pagePlaceholder = config.pagePlaceholder

  const cleanText = el => el.text().trim()
  const cleanHref = el => {
    const href = el.attr('href')
    return href.startsWith(config.dstuHost)
      ? href
      : config.dstuHost + href
  }

  const loadPostings = userId => {
    const profileUrl = profileTemplate
      .replace(userIdPlaceholder, userId)
      .replace(pagePlaceholder, 1)

    logger.info(`user profile ${userId}`)
    return requestPage(profileUrl)
      .then(firstPage => {
        const userName = extractUserName(firstPage)
        const firstPagePostings = extractPostings(firstPage)
        return Promise.all(findRemainingLinks(firstPage)
          .map(link => requestPage(link).then(extractPostings))
        ).then(remainingPostings => {
          const postings = [].concat.apply(firstPagePostings, remainingPostings)
          logger.info(`user profile ${userId} DONE`)
          return { userName, postings }
        })
      })
  }

  const requestPage = url => {
    logger.info(`postings: ${url}`)
    return requests.getHtml(url)
      .then(result => {
        logger.info(`postings: ${url} DONE`)
        return result
      })
  }
  const findRemainingLinks = page => page('div.paging_scroller_container').first()
    .children().not('.current')
    .map((_, pageAnchor) => cleanHref($(pageAnchor)))
    .get()

  const extractUserName = page => cleanText(page('div#up_user h2'))
  const extractPostings = page => page('.posting').map(extractPosting).get()

  const extractPosting = (_, postingDiv) => {
    const textDiv = $('.text', postingDiv)
    textDiv.find('br').replaceWith('\n')

    const title = cleanText($('strong', textDiv))
    const content = cleanText($('span', textDiv))
    const url = cleanHref($('a', textDiv))

    const article = extractArtice(postingDiv)
    return { title, content, url, article }
  }

  const extractArtice = postingDiv => {
    const articleAnchor = $('.article a', postingDiv)
    const title = cleanText(articleAnchor)
    const section = cleanText($('.article h5', postingDiv))
    const url = cleanHref(articleAnchor)
    return { title, url, section }
  }

  return {
    loadPostings
  }
}

module.exports = UserService
