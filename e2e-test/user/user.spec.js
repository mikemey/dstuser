const { Key } = require('protractor')

const searchPage = require('./searchPage')
const derStandard = require('../derStandardMock')

describe('User main page', () => {
  describe('static elements', () => {
    beforeAll(searchPage.open)

    it('should show status message "ready"', () => {
      expect(searchPage.statusText()).toEqual('ready')
    })

    it('should show userId label', () => {
      expect(searchPage.formLabel()).toEqual('User ID:')
    })

    it('should show userId input', () => {
      expect(searchPage.userIdInput().isDisplayed()).toBeTruthy()
    })

    it('should show search postings button', () => {
      expect(searchPage.searchButton().isDisplayed()).toBeTruthy()
    })

    it('should hide error box', () => {
      expect(searchPage.errorBox().isDisplayed()).toBeFalsy()
    })
  })

  describe('userId input validation', () => {
    beforeEach(searchPage.open)

    it('button disabled when no userId', () => {
      expect(searchPage.searchButton().isEnabled()).toBeFalsy()
    })

    it('button disabled when non-digit characters in userId', () => {
      searchPage.setUserId('123x')
      expect(searchPage.searchButton().isEnabled()).toBeFalsy()
    })

    it('allow only 8 characters', () => {
      searchPage.setUserId('123456789')
      expect(searchPage.getUserId()).toEqual('12345678')
      expect(searchPage.searchButton().isEnabled()).toBeTruthy()
    })
  })

  describe('user search (single comment page)', () => {
    const userId = '755005'
    const pageNum = 1

    beforeEach(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, pageNum)
      searchPage.open()
    })

    afterEach(derStandard.stop)

    it('should forward to user page', () => {
      searchPage.requestUserComments(userId)
      expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`/search/${userId}$`))
    })

    it('should show user name', () => {
      expect(searchPage.getUserName()).toEqual('')
      searchPage.requestUserComments(userId)
      expect(searchPage.getUserName()).toEqual('a standard user')
    })

    it('should start request when Key.ENTER pressed', () => {
      searchPage.userIdInput().sendKeys(userId, Key.ENTER)
      expect(searchPage.getUserName()).toEqual('a standard user')
    })

    it('should request comments when URL contains userId', () => {
      searchPage.open(`#!/search/${userId}`)
      expect(searchPage.getUserId()).toEqual(userId)
      expect(searchPage.getUserName()).toEqual('a standard user')
    })
  })

  describe('derStandard errors', () => {
    const userId = '755005'
    beforeEach(() => {
      derStandard.start()
    })

    it('should show error message', () => {
      derStandard.server404WhenUserPageFor(userId)
      searchPage.open()
      searchPage.requestUserComments(userId)

      expect(searchPage.errorBox().isDisplayed()).toBeTruthy()
      expect(searchPage.getErrorMessage()).toEqual(`User ID not found: ${userId}`)
    })
  })
})
