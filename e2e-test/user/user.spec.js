const { Key } = require('protractor')

const derStandard = require('../derStandardMock')
const searchPage = require('./searchPage')

describe('User main page', () => {
  describe('static elements', () => {
    beforeAll(searchPage.open)

    it('should show userId label', () => {
      expect(searchPage.formLabel()).toEqual('user ID')
    })

    it('should show userId input', () => {
      expect(searchPage.userIdInput().isDisplayed()).toBeTruthy()
    })

    it('should show search postings button', () => {
      expect(searchPage.searchButton().isDisplayed()).toBeTruthy()
    })

    it('should hide error box', () => {
      expect(searchPage.hasErrorMessage()).toBeFalsy()
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

    it('should show user comments', async () => {
      const expectedPostings = derStandard.getCommentResult(userId).postings
      searchPage.requestUserComments(userId)
      const comments = await searchPage.getComments()

      expectedPostings.forEach((expected, ix) => {
        expect(comments[ix].title).toBe(expected.title, `title ix: ${ix}`)
        expect(comments[ix].content).toBe(expected.content, `content ix: ${ix}`)
        expect(comments[ix].url).toBe(expected.url, `url ix: ${ix}`)
        expect(comments[ix].articleTitle).toBe(expected.article.title, `article.title ix: ${ix}`)
        expect(comments[ix].articleUrl).toBe(expected.article.url, `article.url ix: ${ix}`)
      })
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

      expect(searchPage.hasErrorMessage()).toBeTruthy()
      expect(searchPage.getErrorMessage()).toEqual(`User ID not found: ${userId}`)
    })
  })
})
