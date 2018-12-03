const { by, browser, element } = require('protractor')

const open = () => browser.get('./')
const statusText = () => element(by.id('status')).getText()
const searchUserLabel = () => element(by.xpath('//form/label')).getText()

const searchUserButton = () => element(by.xpath('//form/button'))
const searchUserInput = () => element(by.name('userId'))

const searchUser = userId => {
  searchUserInput().sendKeys(userId)
  searchUserButton().click()
}

const getBrowserUrl = () => browser.driver.getCurrentUrl()

const getUserName = () => element(by.className('userName')).getText()

module.exports = {
  open,
  statusText,
  searchUserLabel,
  searchUserButton,
  searchUserInput,
  searchUser,
  getUserName,
  getBrowserUrl
}
