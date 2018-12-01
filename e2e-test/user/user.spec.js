const { by, browser, element } = require('protractor')

describe('User main page', () => {
  describe('static elements', () => {
    beforeEach(() => {
      browser.get('./')
    })

    it('should show status message "ready"', () => {
      const status = element(by.id('status'))
      expect(status.getText()).toEqual('ready')
    })

    it('should show userId label', () => {
      const userInputLabel = element(by.xpath('//form/label'))
      expect(userInputLabel.getText()).toEqual('User ID:')
    })

    it('should show userId input', () => {
      const userInput = element(by.name('userId'))
      expect(userInput.isDisplayed()).toBeTruthy()
    })

    it('should show search postings button', () => {
      const searchButton = element(by.xpath('//form/button'))
      expect(searchButton.isDisplayed()).toBeTruthy()
    })
  })
})
