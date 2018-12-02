const SearchPage = require('./searchPage')
const DerStandardMock = require('../derStandardMock')

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

  describe('user search', () => {
    const derStandard = DerStandardMock()

    beforeEach(derStandard.start)
    afterEach(derStandard.stop)

    it('should display comments', () => {
      const userId = 755005
      const pageNum = 1
      derStandard.serveUserPage(userId, pageNum)

      SearchPage.open()
      SearchPage.searchUserInput().sendKeys(userId)
      SearchPage.searchUserButton().click()

      expect(SearchPage.searchUserButton().isDisplayed()).toBeTruthy()
    })
  })
})
