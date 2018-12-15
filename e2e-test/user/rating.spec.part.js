const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  describe('ratings', () => {
    const userId = '755005'
    let serverUrl
    const getServerUrl = path => `${serverUrl}/${path}`

    beforeAll(() => {
      derStandard.start().then(srv => {
        serverUrl = `${srv}/dstu`
      })
      derStandard.serveUserPageFor(userId, 1)
      return searchPage.openUserPage(userId)
    })

    afterAll(derStandard.stop)

    it('should have empty ratings links', () => {
      const emptyHref = getServerUrl('#')
      expect(searchPage.getRatingHrefs()).toEqual([emptyHref, emptyHref, emptyHref])
    })
  })
}
