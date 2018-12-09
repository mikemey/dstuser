const { Key } = require('protractor')

const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const hideElementsScreen = searchPage.getHiddenScreen()

  describe('user search (single comment page)', () => {
    const userId = '755005'
    const pageNum = 1

    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, pageNum)
    })

    afterAll(derStandard.stop)

    beforeEach(searchPage.open)

    it('should forward to user page', () => {
      searchPage.requestUserComments(userId)
      expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`/search/${userId}$`))
    })

    it('should show user name', () => {
      expect(searchPage.hasUserName()).toBeFalsy()
      searchPage.requestUserComments(userId)
      expect(searchPage.getUserName()).toEqual('a standard user')
      expect(searchPage.hasUserName(hideElementsScreen)).toBeFalsy()
    })

    it('should start request when Key.ENTER pressed', () => {
      searchPage.sendToUserId(userId)
      searchPage.sendToUserId(Key.ENTER)
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
        expect(comments[ix].title()).toBe(expected.title, `title ix: ${ix}`)
        expect(comments[ix].content()).toBe(expected.content, `content ix: ${ix}`)
        expect(comments[ix].url()).toBe(expected.url, `url ix: ${ix}`)
        expect(comments[ix].articleTitle()).toBe(expected.article.title, `article.title ix: ${ix}`)
        expect(comments[ix].articleUrl()).toBe(expected.article.url, `article.url ix: ${ix}`)
      })
    })
  })

  describe('derStandard errors', () => {
    const userId = '755005'
    beforeEach(derStandard.start)
    afterEach(derStandard.stop)

    it('should show error message', () => {
      derStandard.server404WhenUserPageFor(userId)
      searchPage.open()
      searchPage.requestUserComments(userId)

      expect(searchPage.hasErrorMessage()).toBeTruthy()
      expect(searchPage.hasErrorMessage(hideElementsScreen)).toBeFalsy()
      expect(searchPage.getErrorMessage()).toEqual(`User ID not found: ${userId}`)
    })
  })
}
