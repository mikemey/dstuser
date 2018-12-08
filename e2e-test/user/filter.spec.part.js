// const { Key } = require('protractor')

const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const hideElementsScreen = searchPage.getHiddenScreen()
  const singlePageUserId = 755005
  const userId = 425185

  describe(`[${searchPage.id}]: filter input field`, () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(singlePageUserId, 1)
      derStandard.serveUserPageFor(userId, 1)
      derStandard.serveUserPageFor(userId, 2)
      derStandard.serveUserPageFor(userId, 3)
    })

    afterAll(derStandard.stop)
    beforeEach(searchPage.open)

    it('disabled when no user searched', () => {
      expect(searchPage.hasFilter()).toBeTruthy()
      expect(searchPage.hasFilter(hideElementsScreen)).toBeFalsy()
      expect(searchPage.isFilterEnabled()).toBeFalsy()
    })
    // it('disabled when user not found', () => {
    // })
  })

  // describe(`[${searchPage.id}]: filter postings`, () => {
  // it('enabled when user comments shown', () => {
  //   expect(searchPage.hasUserName()).toBeFalsy()
  //   expect(searchPage.hasUserName(hideElementsScreen)).toBeFalsy()
  // })

  // it('should not reload page when Key.Enter', async () => {
  //   const singlePageUserId = 755005
  //   searchPage.requestUserComments(singlePageUserId)
  //   expect(searchPage.getComments().length).to.Be(0)
  //   expect(comments[ix].title).toBe(expected.title)
  // })

  // it('should not filter comments when no input', async () => {
  //   const singlePageUserId = 755005
  //   searchPage.requestUserComments(singlePageUserId)
  //   const comments = await searchPage.getComments()
  //   expect(comments[ix].title).toBe(expected.title)
  // })
  // })
}
