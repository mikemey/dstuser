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

    const morePostingsLabel = (from, to, total) => new RegExp(`show more postings… {2}\\(${from} - ${to} of ${total}\\)`)

    describe('no "more postings" button', () => {
      it('when no user', () => {
        searchPage.open()
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
      })

      it('when not enough postings for pagination', () => {
        searchPage.openUserPage(smallUserId)
        searchPage.waitForPostingsLoaded()
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
      })
    })

    describe('Large user page', () => {
      beforeAll(() => {
        searchPage.openUserPage(largeUserId)
        return searchPage.waitForPostingsLoaded()
      })

      it('"more postings" button is available', () => {
        expect(searchPage.hasMorePostingsButton()).toBeTruthy()
      })

      it('"more postings" click will show more postings', () => {
        expect(searchPage.comments.countComments()).toEqual(48)
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(1, 48, 1010))

        searchPage.clickMorePostingsButton()
        expect(searchPage.comments.countComments()).toEqual(96)
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(1, 96, 1010))
      })
    })

    describe('Medium user page "more postings" button', () => {
      beforeAll(() => searchPage.openUserPage(mediumUserId))

      it('button dissapears when reaching end', () => {
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(1, 48, 50))
        searchPage.clickMorePostingsButton()

        expect(searchPage.comments.countComments()).toEqual(50)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
      })
    })
  })
}
