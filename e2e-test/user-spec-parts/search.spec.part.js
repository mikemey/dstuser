const { Key } = require('protractor')

const derStandard = require('../derStandardMock')
const { activeElementId } = require('../utils/utils.page')

module.exports = searchPage => {
  const hideElementsScreen = searchPage.getHiddenScreen()

  const getExpectedPostings = userId => {
    const commentResult = derStandard.getCommentResult(userId)
    return commentResult.reduce((postings, current) => postings.concat(current.postings), [])
  }

  describe('user search (single comment page)', () => {
    const userId = '755005'

    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, 1)
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
      searchPage.sendToUserId(userId + Key.ENTER)
      expect(searchPage.getUserName()).toEqual('a standard user')
    })

    it('should request comments when URL contains userId', () => {
      searchPage.open(`#!/search/${userId}`)
      expect(searchPage.getUserId()).toEqual(userId)
      expect(searchPage.getUserName()).toEqual('a standard user')
    })

    it('should show user comments', async () => {
      const expectedPostings = getExpectedPostings(userId)
      searchPage.requestUserComments(userId)
      const comments = await searchPage.comments.getComments()

      expectedPostings.forEach((expected, ix) => {
        expect(comments[ix].title()).toBe(expected.title, `title ix: ${ix}`)
        expect(comments[ix].content()).toBe(expected.content, `content ix: ${ix}`)
        expect(comments[ix].date()).toBe(expected.uiDate, `date ix: ${ix}`)
        expect(comments[ix].url()).toBe(expected.url, `url ix: ${ix}`)
        expect(comments[ix].articleTitle()).toBe(expected.article.title, `article.title ix: ${ix}`)
        expect(comments[ix].articleUrl()).toBe(expected.article.url, `article.url ix: ${ix}`)
        expect(comments[ix].articleSection()).toBe(expected.article.section, `article.section ix: ${ix}`)
        expect(comments[ix].ratingPos()).toBe(expected.rating.pos, `rating.pos ix: ${ix}`)
        expect(comments[ix].ratingNeg()).toBe(expected.rating.neg, `rating.neg ix: ${ix}`)
      })
    })
  })

  describe('user search (multiple comment pages)', () => {
    const userId = '425185'

    beforeAll(() => Promise
      .all([
        derStandard.start(),
        derStandard.serveUserPageFor(userId, 1),
        derStandard.serveUserPageFor(userId, 2),
        derStandard.serveUserPageFor(userId, 3)
      ])
      .then(() => searchPage.openUserPage(userId))
    )

    afterAll(derStandard.stop)

    it('should show user comments', async () => {
      const expectedPostings = getExpectedPostings(userId)
      const comments = await searchPage.comments.getComments()
      expect(comments.length).toBe(30)

      const expectedBgClasses = [
        'international', 'inland',
        'wirtschaft', 'web', 'sport',
        'panorama', 'etat', 'kultur',
        'wissenschaft', 'gesundheit',
        'bildung', 'reisen', 'lifestyle'
      ]

      expectedPostings.forEach((expected, ix) => {
        expect(comments[ix].title()).toBe(expected.title, `title ix: ${ix}`)
        expect(comments[ix].content()).toBe(expected.content, `content ix: ${ix}`)
        expect(comments[ix].url()).toBe(expected.url, `url ix: ${ix}`)
        expect(comments[ix].articleTitle()).toBe(expected.article.title, `article.title ix: ${ix}`)
        expect(comments[ix].articleUrl()).toBe(expected.article.url, `article.url ix: ${ix}`)
        expect(comments[ix].articleSection()).toBe(expected.article.section, `article.section ix: ${ix}`)
        if (ix < expectedBgClasses.length) {
          expect(comments[ix].commentBoxClasses())
            .toMatch(new RegExp(`${expectedBgClasses[ix]}`), `class Contains ix: ${ix}`)
        }
      })
    })
  })

  describe('derStandard errors', () => {
    const userId = '755005'
    beforeEach(derStandard.start)
    afterEach(derStandard.stop)

    it('should show error message', () => {
      derStandard.server404WhenUserPageFor(userId)
      searchPage.openUserPage(userId)

      expect(searchPage.hasErrorMessage()).toBeTruthy()
      expect(searchPage.hasErrorMessage(hideElementsScreen)).toBeFalsy()
      expect(searchPage.getErrorMessage()).toEqual(`User ID not found: ${userId}`)
      expect(searchPage.userId()).toEqual(activeElementId())
    })
  })
}
