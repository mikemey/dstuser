const { by, browser, element } = require('protractor')

const getBrowserUrl = () => browser.driver.getCurrentUrl()
const open = (path = '#!/search') => browser.get(path)

const userIdInput = () => element(by.id('userId'))
const formLabel = () => userIdInput().getAttribute('placeholder')
const searchButton = () => element(by.xpath('//form//button'))

const setUserId = userId => userIdInput().sendKeys(userId)
const getUserId = () => userIdInput().getAttribute('value')

const requestUserComments = userId => {
  setUserId(userId)
  searchButton().click()
}

const getUserName = () => element(by.id('userName')).getText()

const byErrorMessage = by.id('errorMessage')
const hasErrorMessage = () => browser.isElementPresent(byErrorMessage)
const getErrorMessage = () => element(byErrorMessage).getText()

const getComments = () => element.all(by.className('cmnt-box'))
  .map(createComment)

const createComment = el => {
  const titleEl = el.element(by.className('cmnt-title'))
  const urlEl = el.element(by.className('cmnt-url'))
  const contentEl = el.element(by.className('cmnt-content'))
  const articleEl = el.element(by.className('cmnt-article'))
  return {
    title: titleEl.getText(),
    url: urlEl.getAttribute('ng-href'),
    content: contentEl.getText(),
    articleTitle: articleEl.getText(),
    articleUrl: articleEl.getAttribute('ng-href')
  }
}

module.exports = {
  getBrowserUrl,
  open,
  formLabel,
  searchButton,
  userIdInput,
  requestUserComments,
  getUserName,
  setUserId,
  getUserId,
  hasErrorMessage,
  getErrorMessage,
  getComments
}
