const { SearchPage, ALL_SCREENS } = require('./pageobjects/search.page')

const testParts = [
  require('./user-spec-parts/html.spec.part'),
  require('./user-spec-parts/search.spec.part'),
  require('./user-spec-parts/filter.spec.part'),
  require('./user-spec-parts/rating.spec.part'),
  require('./user-spec-parts/stats.spec.part'),
  require('./user-spec-parts/pagination.spec.part')
]

ALL_SCREENS.forEach(testScreen => {
  const searchPage = SearchPage(testScreen)

  describe(`[${searchPage.id}]:`, () => {
    testParts.forEach(part => part(searchPage))
  })
})
