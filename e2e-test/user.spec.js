const { SearchPage, ALL_SCREENS } = require('./pageobjects/search.page')

const htmlTests = require('./user-spec-parts/html.spec.part')
const searchUserTests = require('./user-spec-parts/search.spec.part')
const filterCommentsTests = require('./user-spec-parts/filter.spec.part')
const ratingsTests = require('./user-spec-parts/rating.spec.part')
const statsTests = require('./user-spec-parts/stats.spec.part')

ALL_SCREENS.forEach(testScreen => {
  const searchPage = SearchPage(testScreen)

  describe(`[${searchPage.id}]:`, () => {
    htmlTests(searchPage)
    searchUserTests(searchPage)
    filterCommentsTests(searchPage)
    ratingsTests(searchPage)
    statsTests(searchPage)
  })
})
