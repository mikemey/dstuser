const derStandard = require('../derStandardMock')

module.exports = searchPage => {
  const smallUserId = 755005
  const mediumUserId = 799724
  const largeUserId = 799725

  describe('pagination', () => {
    beforeAll(() => {
      derStandard.start()
      derStandard.serveUserPageFor(smallUserId, 1)
      derStandard.serveDefaultUserPageFor(mediumUserId)
      derStandard.serveDefaultUserPageFor(largeUserId)
    })

    afterAll(derStandard.stop)

    describe('no "more postings" button', () => {
      it('when no user', () => {
        searchPage.open()
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
      })

      it('when not enough postings for pagination', () => {
        searchPage.openUserPage(smallUserId)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
      })
    })

    describe('Large user page "more postings" button', () => {
      beforeAll(() => searchPage.openUserPage(largeUserId))

      it('is available', () => {
        expect(searchPage.hasMorePostingsButton()).toBeTruthy()
      })

      it('click will show more postings', () => {
        expect(searchPage.comments.countComments()).toEqual(48)
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(/\(48 of/)

        searchPage.clickMorePostingsButton()
        expect(searchPage.comments.countComments()).toEqual(96)
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(/\(96 of/)
      })
    })

    describe('Medium user page "more postings" button', () => {
      beforeAll(() => searchPage.openUserPage(mediumUserId))

      it('button dissapears when reaching end', () => {
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(/\(48 of/)
        searchPage.clickMorePostingsButton()

        expect(searchPage.comments.countComments()).toEqual(50)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
      })
    })
  })
}
