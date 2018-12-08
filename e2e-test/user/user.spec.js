const { SearchPage, ALL_SCREENS } = require('./searchPage')

const htmlTests = require('./html.spec.part')
const searchUserTests = require('./search.spec.part')
const filterCommentsTests = require('./filter.spec.part')

ALL_SCREENS.forEach(testScreen => {
  const searchPage = SearchPage(testScreen)

  htmlTests(searchPage)
  searchUserTests(searchPage)
  filterCommentsTests(searchPage)
})
