const $ = require('cheerio')
const requests = require('../utils/requests')

const UserService = config => {
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

    return requests.getHtml(profileUrl)
      .then(firstPage => {
        const userName = extractUserName(firstPage)
        const postings = extractPostings(firstPage)
        return {
          userName, postings
        }
      })
  }

  const extractUserName = page => cleanText(page('div#up_user h2'))
  const extractPostings = page => page('.posting').map(extractPosting).get()

  const extractPosting = (_, postingDiv) => {
    const textDiv = $('.text', postingDiv)
    const title = cleanText($('strong', textDiv))
    const content = cleanText($('span', textDiv))
    const url = cleanHref($('a', textDiv))

    const article = extractArtice(postingDiv)
    return { title, content, url, article }
  }

  const extractArtice = postingDiv => {
    const articleAnchor = $('.article a', postingDiv)
    const title = cleanText(articleAnchor)
    const url = cleanHref(articleAnchor)
    return { title, url }
  }

  return {
    loadPostings
  }
}

module.exports = UserService
