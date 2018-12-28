const { by, element } = require('protractor')

const { onlyDisplayed, getHref, asNumber, getText, waitForElementClick, waitForVisibleElements } = require('../utils/utils.page')

const byCommentBox = by.className('cmnt-box')
const displayedComments = () => waitForVisibleElements(byCommentBox)
const getComments = () => displayedComments().then(comments => comments.map(createComment))
const countComments = () => displayedComments().then(comments => comments.length)

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
    url: () => getHref(urlEl, 'ng-href'),
    content: () => contentEl.getText(),
    date: () => dateEl.getText(),
    articleTitle: () => articleEl.getText(),
    articleUrl: () => getHref(articleEl, 'ng-href'),
    articleSection: () => sectionEl.getText(),
    commentBoxClasses: () => el.getAttribute('class'),
    ratingPos: () => ratePosEl.getText().then(asNumber),
    ratingNeg: () => rateNegEl.getText().then(asNumber)
  }
}

const getHighlightedTexts = () => element.all(by.className('highlightedText'))
  .map(getText)

const getRatingHrefs = () => element.all(by.css('.cmnt-rate a'))
  .filter(onlyDisplayed).map(el => getHref(el))

const byRatingLink = postingId => by.id(`ln-${postingId}`)
const clickRating = postingId => waitForElementClick(byRatingLink(postingId))

const getPositiveRaters = () => element.all(by.className('rating-pos'))
  .filter(onlyDisplayed).map(getText)
const getNegativeRaters = () => element.all(by.className('rating-neg'))
  .filter(onlyDisplayed).map(getText)

const clickRater = ix => element.all(by.className('rater-entry')).get(ix).click()

/* eslint object-property-newline: "off" */
module.exports = {
  getComments,
  countComments,
  getHighlightedTexts,
  getRatingHrefs, clickRating,
  getPositiveRaters, getNegativeRaters, clickRater
}
