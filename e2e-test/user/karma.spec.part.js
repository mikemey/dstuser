const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const smallUserId = 755005
  const userId = 425185
  const largeUserId = 799725

  describe('user stats', () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(smallUserId, 1)
      derStandard.serveUserPageFor(userId, 1)
      derStandard.serveUserPageFor(userId, 2)
      derStandard.serveUserPageFor(userId, 3)
      derStandard.serveDefaultUserPageFor(largeUserId)
    })

    afterAll(derStandard.stop)

    describe('karma points', () => {
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

    describe('number of total posts', () => {
      it('hidden when no user', () => {
        searchPage.open()
        expect(searchPage.hasPostingTotal()).toBeFalsy()
      })

      it('shows when user (large user page)', () => {
        searchPage.openUserPage(largeUserId)
        expect(searchPage.hasPostingTotal()).toBeTruthy()
        expect(searchPage.getPostingTotal()).toEqual(1010)
      })
    })
  })
}
