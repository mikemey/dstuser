const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const hideElementsScreen = searchPage.getHiddenScreen()
  const userId = '755005'
  const postingIds = [1034153378, 1034368216, 1036279475]

  describe('karma points', () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, 1)
      postingIds.forEach(postingId =>
        derStandard.serveRating(userId, postingId)
      )
    })

    afterAll(derStandard.stop)

    it('hidden when no user', () => {
      searchPage.open()
      expect(searchPage.hasKarma()).toBeFalsy()
      expect(searchPage.hasKarma(hideElementsScreen)).toBeFalsy()
    })
  })
}
