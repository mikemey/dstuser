const SearchPage = require('./searchPage')

describe('User main page', () => {
  describe('static elements', () => {
    beforeAll(SearchPage.open)

    it('should show status message "ready"', () => {
      expect(SearchPage.statusText()).toEqual('ready')
    })

    it('should show userId label', () => {
      expect(SearchPage.searchUserLabel()).toEqual('User ID:')
    })

    it('should show userId input', () => {
      expect(SearchPage.searchUserInput().isDisplayed()).toBeTruthy()
    })

    it('should show search postings button', () => {
      expect(SearchPage.searchUserButton().isDisplayed()).toBeTruthy()
    })
  })
})
