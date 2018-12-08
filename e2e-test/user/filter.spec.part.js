const { Key } = require('protractor')

const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const hideElementsScreen = searchPage.getHiddenScreen()
  const singlePageUserId = 755005
  const userId = 425185

  describe(`[${searchPage.id}]: filter`, () => {
    beforeAll(() => {
      derStandard.start()
    })
    afterAll(derStandard.stop)

    beforeEach(searchPage.open)

    describe(`input field is disabled`, () => {
      it('when no user searched', () => {
        expect(searchPage.hasFilter()).toBeTruthy()
        expect(searchPage.hasFilter(hideElementsScreen)).toBeFalsy()
        expect(searchPage.isFilterEnabled()).toBeFalsy()
      })

      it('when user not found', () => {
        const unknownUserId = 99
        searchPage.requestUserComments(unknownUserId)
        expect(searchPage.getErrorMessage()).toMatch(`${unknownUserId}`)
        expect(searchPage.isFilterEnabled()).toBeFalsy()
      })
    })

    describe('input field behaviour', () => {
      beforeAll(() => {
        derStandard.serveUserPageFor(singlePageUserId, 1)
        derStandard.serveUserPageFor(userId, 1)
        derStandard.serveUserPageFor(userId, 2)
        derStandard.serveUserPageFor(userId, 3)
      })

      beforeEach(async () => {
        searchPage.requestUserComments(singlePageUserId)
        const comments = await searchPage.getComments()
        expect(comments.length).toBe(3)
      })

      it('is enabled when user comments shown', () => {
        expect(searchPage.isFilterEnabled()).toBeTruthy()
      })

      it('should not reload page when Key.Enter', () => {
        searchPage.sendToUserId(23)
        searchPage.sendToFilter(Key.ENTER)
        expect(searchPage.getBrowserUrl())
          .toMatch(new RegExp(`/search/${singlePageUserId}$`))
      })
    })

    // describe('posting filtering', () => {
    //   beforeAll(() => {
    //     derStandard.serveUserPageFor(userId, 1)
    //     derStandard.serveUserPageFor(userId, 2)
    //     derStandard.serveUserPageFor(userId, 3)
    //   })
    // })
  })
}
