const { by, browser, element } = require('protractor')

// large screen -> xxx-small element identifiers
const LARGE_SCREEN = { id: 'LARGE SCREEN', width: 1000, height: 800, suffix: 'small' }
// medium screen -> xxx-large element identifiers
const MEDIUM_SCREEN = { id: 'MEDIUM SCREEN', width: 720, height: 600, suffix: 'large' }
// small screen -> xxx-large element identifiers
const SMALL_SCREEN = { id: 'SMALL SCREEN', width: 540, height: 500, suffix: 'large' }

// const ALL_SCREENS = [LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN]
const ALL_SCREENS = [LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN]

const hasElement = byElement => browser
  .isElementPresent(byElement)
  .then(isElementPresent => isElementPresent
    ? element(byElement).isDisplayed()
    : Promise.resolve(false)
  )

const SearchPage = testScreen => {
  if (!ALL_SCREENS.includes(testScreen)) {
    throw Error(`unknown screen size: >${testScreen}<`)
  }

  const getHiddenScreen = () => testScreen === LARGE_SCREEN
    ? SMALL_SCREEN
    : LARGE_SCREEN

  const getBrowserUrl = () => browser.driver.getCurrentUrl()
  const open = (path = '#!/search') => Promise.all([
    browser.get(path),
    browser.manage().window().setSize(testScreen.width, testScreen.height)
  ])

  const byUserId = (screen = testScreen) => by.id(`userId-${screen.suffix}`)
  const hasUserIdInput = screen => hasElement(byUserId(screen))

  const userIdInput = () => element(byUserId())
  const getUserId = () => userIdInput().getAttribute('value')
  const sendToUserId = userId => userIdInput().sendKeys(userId)
  const formLabel = () => userIdInput().getAttribute('placeholder')

  const bySearchButton = (screen = testScreen) => by.id(`searchBtn-${screen.suffix}`)
  const searchButton = () => element(bySearchButton())
  const hasSearchButton = screen => hasElement(bySearchButton(screen))
  const isSearchButtonEnabled = () => searchButton().isEnabled()

  const requestUserComments = userId => {
    sendToUserId(userId)
    searchButton().click()
  }

  const byUserName = (screen = testScreen) => by.id(`userName-${screen.suffix}`)
  const hasUserName = screen => hasElement(byUserName(screen))
  const getUserName = () => element(byUserName()).getText()

  const byErrorMessage = (screen = testScreen) => by.id(`errorMessage-${screen.suffix}`)
  const hasErrorMessage = screen => hasElement(byErrorMessage(screen))
  const getErrorMessage = () => element(byErrorMessage()).getText()

  const getComments = () => element.all(by.className('cmnt-box'))
    .filter(el => el.isDisplayed())
    .map(createComment)

  const createComment = el => {
    const titleEl = el.element(by.className('cmnt-title'))
    const urlEl = el.element(by.className('cmnt-url'))
    const contentEl = el.element(by.className('cmnt-content'))
    const articleEl = el.element(by.className('cmnt-article'))
    const sectionEl = el.element(by.className('cmnt-section'))
    return {
      title: () => titleEl.getText(),
      url: () => urlEl.getAttribute('ng-href'),
      content: () => contentEl.getText(),
      articleTitle: () => articleEl.getText(),
      articleUrl: () => articleEl.getAttribute('ng-href'),
      articleSection: () => sectionEl.getText()
    }
  }

  const byFilter = (screen = testScreen) => by.id(`filter-${screen.suffix}`)
  const hasFilter = screen => hasElement(byFilter(screen))
  const filterInput = () => element(byFilter())
  const isFilterEnabled = () => filterInput().isEnabled()
  const sendToFilter = filter => filterInput().sendKeys(filter)

  const getHighlightedTexts = () => element.all(by.className('highlightedText'))
    .map(createTexts)

  const createTexts = el => {
    return {
      getText: () => el.getText()
    }
  }

  /* eslint object-property-newline: "off" */
  return {
    id: testScreen.id,
    getBrowserUrl,
    open,
    getHiddenScreen,
    hasUserIdInput, sendToUserId, getUserId,
    formLabel,
    hasSearchButton, isSearchButtonEnabled,
    requestUserComments,
    getUserName, hasUserName,
    hasErrorMessage, getErrorMessage,
    getComments,
    hasFilter, isFilterEnabled, sendToFilter,
    getHighlightedTexts
  }
}

module.exports = { SearchPage, LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN, ALL_SCREENS }
