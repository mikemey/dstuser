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

const errorBox = () => element(by.id('errorMessage'))
const getErrorMessage = () => errorBox().getText()

const getComments = () => element.all(by.className('comment-box'))
  .map(createComment)

const createComment = el => {
  const titleEl = el.element(by.className('comment-title'))
  const urlEl = el.element(by.className('comment-url'))
  const contentEl = el.element(by.className('comment-content'))
  const articleEl = el.element(by.className('comment-article'))
  return {
    title: titleEl.getText(),
    url: urlEl.getAttribute('href'),
    content: contentEl.getText(),
    articleTitle: articleEl.getText(),
    articleUrl: articleEl.getAttribute('href')
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
  errorBox,
  getErrorMessage,
  getComments
}
