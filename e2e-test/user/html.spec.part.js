module.exports = searchPage => {
  const hideElementsScreen = searchPage.getHiddenScreen()

  describe('User search form', () => {
    beforeAll(searchPage.open)

    describe('user search form', () => {
      it('should show userId label', () => {
        expect(searchPage.formLabel()).toEqual('user ID')
      })

      it(`should show userId input`, () => {
        expect(searchPage.hasUserIdInput()).toBeTruthy()
      })

      it(`should NOT show [${hideElementsScreen.id}] userId input`, () => {
        expect(searchPage.hasUserIdInput(hideElementsScreen)).toBeFalsy()
      })

      it('should show search postings button', () => {
        expect(searchPage.hasSearchButton()).toBeTruthy()
      })

      it(`should NOT show [${hideElementsScreen.id}] search postings button`, () => {
        expect(searchPage.hasSearchButton(hideElementsScreen)).toBeFalsy()
      })

      it('should hide error box(es)', () => {
        expect(searchPage.hasErrorMessage()).toBeFalsy()
        expect(searchPage.hasErrorMessage(hideElementsScreen)).toBeFalsy()
      })

      it(`should hide user name fields`, () => {
        expect(searchPage.hasUserName()).toBeFalsy()
        expect(searchPage.hasUserName(hideElementsScreen)).toBeFalsy()
      })
    })

    describe('userId input validation', () => {
      it('button disabled when no userId', () => {
        expect(searchPage.isSearchButtonEnabled()).toBeFalsy()
      })

      it('button disabled when non-digit characters in userId', () => {
        searchPage.sendToUserId('123x')
        expect(searchPage.isSearchButtonEnabled()).toBeFalsy()
      })

      it('allow only 8 characters', () => {
        searchPage.sendToUserId('123456789')
        expect(searchPage.getUserId()).toEqual('12345678')
        expect(searchPage.isSearchButtonEnabled()).toBeTruthy()
      })
    })
  })
}
