const $ = require('cheerio')

const from = (firstPage, config) => {
  const cleanText = el => el.text().trim()
  const cleanNumber = el => Number(cleanText(el))
  const cleanHref = el => {
    const href = el.attr('href')
    return href.startsWith(config.dstuHost)
      ? href
      : config.dstuHost + href
  }

  const getUserName = () => cleanText(firstPage('div#up_user h2'))

  const getRemainingPageLinks = () => firstPage('div.paging_scroller_container').first()
    .children().not('.current')
    .map((_, pageAnchor) => cleanHref($(pageAnchor)))
    .get()

  const getTotalPostings = () => {
    const fullTotalText = cleanText(firstPage('div.postings div.header span'))
    return Number(fullTotalText.replace(/.*von\s/, ''))
  }

  const getPostings = userPage => userPage('.posting').map(extractPosting).get()

  const extractPosting = (_, postingDiv) => {
    const postingId = $(postingDiv).attr('data-postingid')
    const contentDiv = $('.text', postingDiv)
    contentDiv.find('br').replaceWith('\n')

    const title = cleanText($('strong', contentDiv))
    const content = cleanText($('span', contentDiv))
    const url = cleanHref($('a', contentDiv))
    const date = cleanText($('.absolute', postingDiv))

    const article = extractArtice(postingDiv)
    const rating = extractRating(postingDiv)
    return { postingId, title, content, date, url, article, rating }
  }

  const extractArtice = postingDiv => {
    const articleAnchor = $('.article a', postingDiv)
    const title = cleanText(articleAnchor)
    const section = cleanText($('.article h5', postingDiv))
    const url = cleanHref(articleAnchor)
    return { title, url, section }
  }
  const extractRating = postingDiv => {
    const pos = cleanNumber($('.ratings-positive-count', postingDiv))
    const neg = cleanNumber($('.ratings-negative-count', postingDiv))
    return { pos, neg }
  }

  return {
    getUserName, getRemainingPageLinks, getTotalPostings, getPostings
  }
}

module.exports = { from }
