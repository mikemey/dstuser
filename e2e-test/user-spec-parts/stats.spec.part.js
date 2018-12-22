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
        searchPage.waitForPostingsLoaded()
        expect(searchPage.hasKarmaTotal()).toBeTruthy()
        expect(searchPage.getKarmaTotal()).toEqual([17, 18])
        expect(searchPage.hasPostingTotal()).toBeTruthy()
        expect(searchPage.getPostingTotal()).toEqual(3)
        expect(searchPage.getPagesTotal()).toEqual(1)
      })

      it('multiple user page - karma points + totals', () => {
        searchPage.openUserPage(userId)
        searchPage.waitForPostingsLoaded()
        expect(searchPage.getKarmaTotal()).toEqual([278, 231])
        expect(searchPage.getPostingTotal()).toEqual(30)
        expect(searchPage.getPagesTotal()).toEqual(3)
      })
    })

    describe('large user page #', () => {
      beforeAll(() => searchPage.openUserPage(largeUserId))

      it('shows posting total', () => {
        expect(searchPage.getPostingTotal()).toEqual(1010)
      })

      it('shows pages total', () => {
        expect(searchPage.getPagesTotal()).toEqual(101)
      })

      it('shows not all pages loaded yet', () => {
        expect(searchPage.getPagesLoaded()).toBeLessThan(101)
      })

      describe('after loading is finished', () => {
        beforeAll(() => searchPage.waitForPostingsLoaded())

        it('shows karma total', () => {
          expect(searchPage.getKarmaTotal()).toEqual([606, 404])
        })

        it('shows pages loaded', () => {
          expect(searchPage.getPagesLoaded()).toEqual(101)
        })
      })
    })
  })
}
