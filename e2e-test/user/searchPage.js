const { by, browser, element } = require('protractor')

const SearchPage = {
  open: () => browser.get('./'),
  statusText: () => element(by.id('status')).getText(),
  searchUserLabel: () => element(by.xpath('//form/label')).getText(),

  searchUserButton: () => element(by.xpath('//form/button')),
  searchUserInput: () => element(by.name('userId'))
}

module.exports = SearchPage
