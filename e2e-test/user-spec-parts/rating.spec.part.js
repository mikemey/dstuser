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

      it('for all posts point to nowhere', () => {
        const emptyHref = derStandard.getServerUrl('/dstu/#')
        expect(searchPage.comments.getRatingHrefs()).toEqual([emptyHref, emptyHref, emptyHref])
      })

      it('on click - show pos/neg ratings including deleted user', () => {
        expect(searchPage.comments.getPositiveRaters()).toEqual(['Wolf19710', 'gelöschter User'])
        expect(searchPage.comments.getNegativeRaters()).toEqual(['wilderpel', 'Werner Kargel', 'gelöschter User'])
      })
    })

    describe('rater links', () => {
      beforeEach(() => {
        searchPage.openUserPage(userId)
        searchPage.comments.clickRating(postingId)
      })

      it('should forward to wolf (positive rating)', () => {
        searchPage.comments.clickRater(0)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp('#!/search/248538$'))
      })

      it('should forward to wilderpel (negative rating)', () => {
        searchPage.comments.clickRater(2)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp('#!/search/277282$'))
      })

      it('should NOT forward when deleted user (positive + negative ratings)', () => {
        searchPage.comments.clickRater(1)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`#!/search/${userId}$`))
        searchPage.comments.clickRater(4)
        expect(searchPage.getBrowserUrl()).toMatch(new RegExp(`#!/search/${userId}$`))
      })
    })
  })
}
