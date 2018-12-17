const derStandard = require('../derStandardMock')

module.exports = searchPage => {
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
    })

    it('shows cumulative ratings', () => {
      searchPage.openUserPage(userId)
      expect(searchPage.hasKarma()).toBeTruthy()
      expect(searchPage.getKarmaPoints()).toEqual([17, 18])
    })
  })
}
