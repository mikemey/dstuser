const { SearchPage, ALL_SCREENS } = require('./searchPage')

const htmlTests = require('./user.html.part')
const searchUserTests = require('./user.search.part')

ALL_SCREENS.forEach(testScreen => {
  const searchPage = SearchPage(testScreen)

  htmlTests(searchPage)
  searchUserTests(searchPage)
})
