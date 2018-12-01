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

    it('should show userId input', () => {
      const userInput = element(by.name('userId'))
      expect(userInput.isDisplayed()).toBeTruthy()
    })
  })
})
