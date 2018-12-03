const searchPage = require('./searchPage')
const derStandard = require('../derStandardMock')

describe('User main page', () => {
  describe('static elements', () => {
    beforeAll(searchPage.open)

    it('should show status message "ready"', () => {
      expect(searchPage.statusText()).toEqual('ready')
    })

    it('should show userId label', () => {
      expect(searchPage.searchUserLabel()).toEqual('User ID:')
    })

    it('should show userId input', () => {
      expect(searchPage.searchUserInput().isDisplayed()).toBeTruthy()
    })

    it('should show search postings button', () => {
      expect(searchPage.searchUserButton().isDisplayed()).toBeTruthy()
    })
  })

  describe('user search (single comment page)', () => {
    const userId = 755005
    const pageNum = 1

    beforeEach(() => {
      derStandard.start()
      derStandard.serveUserPage(userId, pageNum)

      searchPage.open()
      searchPage.searchUser(userId)
    })

    afterEach(derStandard.stop)

    it('should show user name', () => {
      expect(searchPage.getUserName()).toEqual('a standard user')
    })
  })
})
