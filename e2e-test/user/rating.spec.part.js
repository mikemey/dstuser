const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const userId = '755005'
  const postingId = 1034153378

  describe('ratings', () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, 1)
      derStandard.serveRating(userId, postingId, `${postingId}_small`)
    })

    afterAll(derStandard.stop)

    describe('rating links', () => {
      beforeAll(() => searchPage.openUserPage(userId))

      it('point to nowhere', () => {
        const emptyHref = derStandard.getServerUrl('/dstu/#')
        expect(searchPage.comments.getRatingHrefs()).toEqual([emptyHref, emptyHref, emptyHref])
      })

      it('should show ratings', () => {
        searchPage.comments.clickRating(postingId)
        expect(searchPage.comments.getPositiveRaters()).toEqual(['Wolf19710'])
        expect(searchPage.comments.getNegativeRaters()).toEqual(['wilderpel', 'Werner Kargel'])
      })
    })

    describe('rater links', () => {
      beforeEach(() => {
        searchPage.openUserPage(userId)
        searchPage.comments.clickRating(postingId)
      })

      afterEach(searchPage.restart)

      it('should forward to wolf', () => {
        searchPage.comments.clickRaterAndFollow(0)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`#!/search/248538$`))
      })

      it('should forward to wilderpel', () => {
        searchPage.comments.clickRaterAndFollow(1)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`#!/search/277282$`))
      })

      it('should forward to kargel', () => {
        searchPage.comments.clickRaterAndFollow(2)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`#!/search/223109$`))
      })
    })
  })
}
