const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const userId = '755005'
  const postingId = 1034153378

  describe('ratings', () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, 1)
      derStandard.serveRating(userId, postingId, `${postingId}_small`)
      searchPage.openUserPage(userId)
      searchPage.comments.clickRating(postingId)
    })

    afterAll(derStandard.stop)

    describe('rating links', () => {
      beforeAll(() => {
        searchPage.openUserPage(userId)
        searchPage.comments.clickRating(postingId)
      })

      it('point to nowhere', () => {
        const emptyHref = derStandard.getServerUrl('/dstu/#')
        expect(searchPage.comments.getRatingHrefs()).toEqual([emptyHref, emptyHref, emptyHref])
      })

      it('should show pos/neg ratings', () => {
        expect(searchPage.comments.getPositiveRaters()).toEqual(['Wolf19710'])
        expect(searchPage.comments.getNegativeRaters()).toEqual(['wilderpel', 'Werner Kargel'])
      })
    })

    describe('rater links', () => {
      beforeEach(() => {
        searchPage.openUserPage(userId)
        searchPage.comments.clickRating(postingId)
      })

      it('should forward to positive and negative rater', () => {
        searchPage.comments.clickRater(0)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`#!/search/248538$`))
      })

      it('should forward to wilderpel', () => {
        searchPage.comments.clickRater(1)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`#!/search/277282$`))
      })
    })
  })
}
