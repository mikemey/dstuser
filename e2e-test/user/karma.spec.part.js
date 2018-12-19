const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const smallUserId = '755005'
  const userId = '425185'

  describe('karma points', () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(smallUserId, 1)
      derStandard.serveUserPageFor(userId, 1)
      derStandard.serveUserPageFor(userId, 2)
      derStandard.serveUserPageFor(userId, 3)
    })

    afterAll(derStandard.stop)

    it('hidden when no user', () => {
      searchPage.open()
      expect(searchPage.hasKarma()).toBeFalsy()
    })

    it('shows cumulative ratings (single user page)', () => {
      searchPage.openUserPage(smallUserId)
      expect(searchPage.hasKarma()).toBeTruthy()
      expect(searchPage.getKarmaPoints()).toEqual([17, 18])
    })

    it('shows cumulative ratings (multiple user page)', () => {
      searchPage.openUserPage(userId)
      expect(searchPage.getKarmaPoints()).toEqual([278, 231])
    })
  })
}
