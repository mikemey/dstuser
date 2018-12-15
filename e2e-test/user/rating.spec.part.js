const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  describe('ratings', () => {
    const userId = '755005'
    const postingId = 1034153378

    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(userId, 1)
      derStandard.serveRating(userId, postingId)
      return searchPage.openUserPage(userId)
    })

    afterAll(derStandard.stop)

    it('should have empty ratings links', () => {
      const emptyHref = derStandard.getServerUrl('/dstu/#')
      expect(searchPage.getRatingHrefs()).toEqual([emptyHref, emptyHref, emptyHref])
    })

    it('should show ratings', () => {
      searchPage.clickRating(postingId)
      expect(searchPage.getPositiveRaters()).toEqual(['Wolf19710'])
      expect(searchPage.getNegativeRaters()).toEqual(['wilderpel', 'Werner Kargel'])
    })
  })
}
