const { by, browser, element } = require('protractor')

describe('User main page', function () {
  describe('static elements', () => {
    beforeEach(() => {
      browser.get('./')
    })

    it('should show status message "ready"', function () {
      const status = element(by.id('status'))
      expect(status.getText()).toEqual('ready')
    })

    it('should show userId input', function () {
      const userInput = element(by.name('userId'))
      expect(userInput.isDisplayed()).toBeTruthy()
    })
  })
})
