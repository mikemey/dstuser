const { SearchPage, ALL_SCREENS } = require('../pageobjects/search.page')

const htmlTests = require('./html.spec.part')
const searchUserTests = require('./search.spec.part')
const filterCommentsTests = require('./filter.spec.part')
const ratingsTests = require('./rating.spec.part')
const statsTests = require('./stats.spec.part')

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
