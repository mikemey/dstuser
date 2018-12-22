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

    describe('when no user', () => {
      beforeAll(searchPage.open)

      it('hidden karma points', () => {
        expect(searchPage.hasKarmaTotal()).toBeFalsy()
      })

      it('hidden posting total', () => {
        expect(searchPage.hasPostingTotal()).toBeFalsy()
      })
    })

    describe('shows for', () => {
      it('single user page - karma points', () => {
        searchPage.openUserPage(smallUserId)
        expect(searchPage.hasKarmaTotal()).toBeTruthy()
        expect(searchPage.getKarmaTotal()).toEqual([17, 18])
      })

      it('multiple user page - karma points', () => {
        searchPage.openUserPage(userId)
        expect(searchPage.getKarmaTotal()).toEqual([278, 231])
      })
    })

    describe('large user page #', () => {
      beforeAll(() => searchPage.openUserPage(largeUserId))

      it('shows karma points', () => {
        expect(searchPage.getKarmaTotal()).toEqual([606, 404])
      })

      it('shows posting total', () => {
        expect(searchPage.hasPostingTotal()).toBeTruthy()
        expect(searchPage.getPostingTotal()).toEqual(1010)
      })
    })
  })
}
