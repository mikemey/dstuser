const { by, browser, element } = require('protractor')

const getBrowserUrl = () => browser.driver.getCurrentUrl()
const open = (path = '#!/search') => browser.get(path)

const statusText = () => element(by.id('status')).getText()
const formLabel = () => element(by.xpath('//form/label')).getText()
const userIdInput = () => element(by.name('userId'))
const searchButton = () => element(by.xpath('//form/button'))

const setUserId = userId => userIdInput().sendKeys(userId)
const getUserId = () => userIdInput().getAttribute('value')

const requestUserComments = userId => {
  setUserId(userId)
  searchButton().click()
}

const getUserName = () => element(by.className('userName')).getText()

const errorBox = () => element(by.className('errorMessage'))
const getErrorMessage = () => errorBox().getText()

module.exports = {
  getBrowserUrl,
  open,
  statusText,
  formLabel,
  searchButton,
  userIdInput,
  requestUserComments,
  getUserName,
  setUserId,
  getUserId,
  errorBox,
  getErrorMessage
}
