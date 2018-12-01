const { by, browser, element } = require('protractor')

const SearchPage = {
  open: () => browser.get('./'),
  statusText: () => element(by.id('status')).getText(),
  searchLabel: () => element(by.xpath('//form/label')).getText(),

  searchButton: () => element(by.xpath('//form/button')),
  searchInput: () => element(by.name('userId'))
}

module.exports = SearchPage
