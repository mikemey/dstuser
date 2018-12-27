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

    const morePostingsLabel = (from, to, total, tail = true) => {
      const arrow = tail ? 'ᐁ' : 'ᐃ'
      return new RegExp(`${arrow} show more postings \\(${from} - ${to} of ${total}\\) ${arrow}`)
    }

    describe('no "more postings" button', () => {
      it('when no user', () => {
        searchPage.open()
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
        expect(searchPage.hasMorePostingsButton('head')).toBeFalsy()
      })

      it('when not enough postings for pagination', () => {
        searchPage.openUserPage(smallUserId)
        searchPage.waitForPostingsLoaded()
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
        expect(searchPage.hasMorePostingsButton('head')).toBeFalsy()
        expect(searchPage.hasPostingPages()).toBeFalsy()
        expect(searchPage.hasPostingPages('head')).toBeFalsy()
      })
    })

    describe('large user page', () => {
      beforeAll(() => {
        searchPage.openUserPage(largeUserId)
        return searchPage.waitForPostingsLoaded()
      })

      it('"more postings tail" button is available', () => {
        expect(searchPage.hasMorePostingsButton()).toBeTruthy()
      })

      it('parts pages are available', () => {
        const expectedPostingPages = Array.from({ length: 22 })
        const emptyHref = derStandard.getServerUrl('/dstu/#')
        const expectedPageNumbers = expectedPostingPages.map((_, ix) => ix + 1)
        const expectedPageLinks = expectedPostingPages.map(_ => emptyHref)

        expect(searchPage.hasMorePostingsButton()).toBeTruthy()
        expect(searchPage.hasMorePostingsButton('head')).toBeFalsy()
        expect(searchPage.hasPostingPages()).toBeTruthy()
        expect(searchPage.getPostingPagesNumbers()).toEqual(expectedPageNumbers)
        expect(searchPage.getPostingPagesLinks()).toEqual(expectedPageLinks)
      })

      it('"more postings tail" click will show more postings', () => {
        expect(searchPage.comments.countComments()).toEqual(48)
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(1, 48, 1010))

        searchPage.clickMorePostingsButton()
        expect(searchPage.comments.countComments()).toEqual(96)
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(1, 96, 1010))
      })

      it('click on page link will jump to page', () => {
        searchPage.clickPostingPageLink(20)
        expect(searchPage.comments.countComments()).toEqual(48)
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(913, 960, 1010))
        expect(searchPage.getMorePostingsButtonLabel('head')).toMatch(morePostingsLabel(913, 960, 1010, false))
      })

      it('click on last page - hide "tail" button, show "head" button', () => {
        searchPage.clickPostingPageLink(22)
        expect(searchPage.comments.countComments()).toEqual(2)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
        expect(searchPage.hasMorePostingsButton('head')).toBeTruthy()
        expect(searchPage.getMorePostingsButtonLabel('head')).toMatch(morePostingsLabel(1009, 1010, 1010, false))
      })

      it('filtering resets pagination', () => {
        searchPage.clickPostingPageLink(20)
        searchPage.sendToFilter('einget')

        expect(searchPage.comments.countComments()).toEqual(48)
        expect(searchPage.getPostingPagesNumbers()).toEqual([1, 2, 3])
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(1, 48, 101))

        searchPage.clickPostingPageLink(3)
        expect(searchPage.comments.countComments()).toEqual(5)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
      })
    })

    describe('medium user page ', () => {
      beforeAll(() => searchPage.openUserPage(mediumUserId))

      it('"more postings tail" button dissapears when reaching end', () => {
        expect(searchPage.getMorePostingsButtonLabel()).toMatch(morePostingsLabel(1, 48, 50))
        searchPage.clickMorePostingsButton()

        expect(searchPage.comments.countComments()).toEqual(50)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
        expect(searchPage.hasMorePostingsButton('head')).toBeFalsy()
      })

      it('"more postings head" button dissapears when reaching start', () => {
        searchPage.clickPostingPageLink(2)
        expect(searchPage.comments.countComments()).toEqual(2)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
        expect(searchPage.hasMorePostingsButton('head')).toBeTruthy()

        expect(searchPage.getMorePostingsButtonLabel('head')).toMatch(morePostingsLabel(49, 50, 50, false))

        searchPage.clickMorePostingsButton('head')
        expect(searchPage.comments.countComments()).toEqual(50)
        expect(searchPage.hasMorePostingsButton()).toBeFalsy()
        expect(searchPage.hasMorePostingsButton('head')).toBeFalsy()
      })
    })
  })
}
