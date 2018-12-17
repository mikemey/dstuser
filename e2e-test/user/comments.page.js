const { by, browser, element } = require('protractor')

const { onlyDisplayed, asHref, asNumber, asText } = require('../utils/utils.page')

const getComments = () => element.all(by.className('cmnt-box'))
  .filter(onlyDisplayed)
  .map(createComment)

const createComment = el => {
  const titleEl = el.element(by.className('cmnt-title'))
  const urlEl = el.element(by.className('cmnt-url'))
  const contentEl = el.element(by.className('cmnt-content'))
  const dateEl = el.element(by.className('cmnt-date'))
  const articleEl = el.element(by.className('cmnt-article'))
  const sectionEl = el.element(by.className('cmnt-section'))
  const ratePosEl = el.all(by.className('karma-pos')).filter(onlyDisplayed).first()
  const rateNegEl = el.all(by.className('karma-neg')).filter(onlyDisplayed).first()

  return {
    title: () => titleEl.getText(),
    url: () => asHref(urlEl, 'ng-href'),
    content: () => contentEl.getText(),
    date: () => dateEl.getText(),
    articleTitle: () => articleEl.getText(),
    articleUrl: () => asHref(articleEl, 'ng-href'),
    articleSection: () => sectionEl.getText(),
    commentBoxClasses: () => el.getAttribute('class'),
    ratingPos: () => ratePosEl.getText().then(asNumber),
    ratingNeg: () => rateNegEl.getText().then(asNumber)
  }
}

const getHighlightedTexts = () => element.all(by.className('highlightedText'))
  .map(asText)

const getRatingHrefs = () => element.all(by.css('.cmnt-rate a'))
  .filter(onlyDisplayed).map(el => asHref(el))

const byPostingId = postingId => by.id(`ln-${postingId}`)
const clickRating = postingId => element(byPostingId(postingId)).click()

const getPositiveRaters = () => element.all(by.className('rating-pos'))
  .filter(onlyDisplayed).map(asText)
const getNegativeRaters = () => element.all(by.className('rating-neg'))
  .filter(onlyDisplayed).map(asText)

const clickRaterAndFollow = ix => element.all(by.className('rater-link')).get(ix).click()
  .then(() => browser.getAllWindowHandles())
  .then(handles => {
    const newWindowHandle = handles[1]
    return browser.switchTo().window(newWindowHandle)
  })

/* eslint object-property-newline: "off" */
module.exports = {
  getComments,
  getHighlightedTexts,
  getRatingHrefs, clickRating,
  getPositiveRaters, getNegativeRaters, clickRaterAndFollow
}
