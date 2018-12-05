const { Key } = require('protractor')

const derStandard = require('../derStandardMock')
const { SearchPage, ALL_SCREENS, hiddenScreen } = require('./searchPage')

ALL_SCREENS.forEach(testScreen => {
  const searchPage = SearchPage(testScreen)

  describe(`[${testScreen.id}] user main page`, () => {
    const hideScreen = hiddenScreen(testScreen)

    describe('static elements', () => {
      beforeAll(searchPage.open)

      it('should show userId label', () => {
        expect(searchPage.formLabel()).toEqual('user ID')
      })

      it(`should show userId input`, () => {
        expect(searchPage.hasUserIdInput()).toBeTruthy()
      })

      it(`should NOT show [${hideScreen.id}] userId input`, () => {
        expect(searchPage.hasUserIdInput(hideScreen)).toBeFalsy()
      })

      it('should show search postings button', () => {
        expect(searchPage.hasSearchButton()).toBeTruthy()
      })

      it(`should NOT show [${hideScreen.id}] search postings button`, () => {
        expect(searchPage.hasSearchButton()).toBeTruthy()
      })

      it('should hide error box', () => {
        expect(searchPage.hasErrorMessage()).toBeFalsy()
      })
    })
  })

  describe('userId input validation', () => {
    beforeEach(searchPage.open)

    it('button disabled when no userId', () => {
      expect(searchPage.isSearchButtonEnabled()).toBeFalsy()
    })

    it('button disabled when non-digit characters in userId', () => {
      searchPage.setUserId('123x')
      expect(searchPage.isSearchButtonEnabled()).toBeFalsy()
    })

    it('allow only 8 characters', () => {
      searchPage.setUserId('123456789')
      expect(searchPage.getUserId()).toEqual('12345678')
      expect(searchPage.isSearchButtonEnabled()).toBeTruthy()
    })
  })

  describe('user search (single comment page)', () => {
    const userId = '755005'
    const pageNum = 1

    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, pageNum)
    })

    afterAll(derStandard.stop)

    beforeEach(() => searchPage.open())

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
      searchPage.setUserId(userId)
      searchPage.setUserId(Key.ENTER)
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
    beforeEach(derStandard.start)
    afterEach(derStandard.stop)

    it('should show error message', () => {
      derStandard.server404WhenUserPageFor(userId)
      searchPage.open()
      searchPage.requestUserComments(userId)

      expect(searchPage.hasErrorMessage()).toBeTruthy()
      expect(searchPage.getErrorMessage()).toEqual(`User ID not found: ${userId}`)
    })
  })
})
