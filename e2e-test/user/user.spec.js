const SearchPage = require('./searchPage')

describe('User main page', () => {
  describe('static elements', () => {
    beforeEach(SearchPage.open)

    it('should show status message "ready"', () => {
      expect(SearchPage.statusText()).toEqual('ready')
    })

    it('should show userId label', () => {
      expect(SearchPage.searchLabel()).toEqual('User ID:')
    })

    it('should show userId input', () => {
      expect(SearchPage.searchInput().isDisplayed()).toBeTruthy()
    })

    it('should show search postings button', () => {
      expect(SearchPage.searchButton().isDisplayed()).toBeTruthy()
    })
  })
})
