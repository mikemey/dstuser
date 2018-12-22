const { Key } = require('protractor')

const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const hideElementsScreen = searchPage.getHiddenScreen()
  const singlePageUserId = 755005
  const userId = 425185

  describe(`Filter`, () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, 1)
      derStandard.serveUserPageFor(userId, 2)
      derStandard.serveUserPageFor(userId, 3)
      derStandard.serveUserPageFor(singlePageUserId, 1)
    })

    afterAll(derStandard.stop)

    describe(`input field is disabled`, () => {
      it('when no user searched', () => {
        searchPage.open()
        expect(searchPage.hasFilter()).toBeTruthy()
        expect(searchPage.hasFilter(hideElementsScreen)).toBeFalsy()
        expect(searchPage.isFilterEnabled()).toBeFalsy()
      })

      it('when user not found', () => {
        const unknownUserId = 99
        searchPage.openUserPage(unknownUserId)
        expect(searchPage.getErrorMessage()).toMatch(`${unknownUserId}`)
        expect(searchPage.isFilterEnabled()).toBeFalsy()
      })
    })

    describe('input field behaviour', () => {
      beforeEach(() => {
        searchPage.openUserPage(singlePageUserId)
        expect(searchPage.comments.countComments()).toEqual(3)
      })

      it('is enabled and not reload page on Key.Enter', () => {
        expect(searchPage.isFilterEnabled()).toBeTruthy()
        searchPage.sendToUserId(23)
        searchPage.sendToFilter(Key.ENTER)
        expect(searchPage.getBrowserUrl())
          .toMatch(new RegExp(`/search/${singlePageUserId}$`))
      })
    })

    describe('posting filtering', () => {
      beforeAll(() => searchPage.openUserPage(userId))

      it('shows all when no filter', () => {
        expect(searchPage.comments.countComments()).toEqual(30)
      })

      it('when single title match and highlight text', async () => {
        const filter = 'versus'
        searchPage.sendToFilter(filter)
        const comments = await searchPage.comments.getComments()
        expect(comments.length).toBe(1)
        expect(comments[0].title()).toBe('Standard versus Kronenzeitung')

        const highlightedText = await searchPage.comments.getHighlightedTexts()
        expect(highlightedText.length).toBe(1)
        expect(highlightedText[0]).toBe(filter)
      })

      it('when single article match', async () => {
        searchPage.sendToFilter('katzian')
        const comments = await searchPage.comments.getComments()
        expect(comments.length).toBe(1)
        expect(comments[0].title()).toBe('Das Ende der AK??')
      })

      it('when many comment contents match', async () => {
        searchPage.sendToFilter('politisch')
        const comments = await searchPage.comments.getComments()
        expect(comments.length).toBe(6)
        expect(comments[0].title()).toBe('Großartiger Erfolg')
      })
    })
  })
}
