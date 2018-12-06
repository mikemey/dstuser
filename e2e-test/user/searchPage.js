const { by, browser, element } = require('protractor')

// large screen -> xxx-small element identifiers
const LARGE_SCREEN = { id: 'LARGE SCREEN', width: 1000, height: 800, suffix: 'small' }
// medium screen -> xxx-large element identifiers
const MEDIUM_SCREEN = { id: 'MEDIUM SCREEN', width: 720, height: 600, suffix: 'large' }
// small screen -> xxx-large element identifiers
const SMALL_SCREEN = { id: 'SMALL SCREEN', width: 540, height: 600, suffix: 'large' }

// const ALL_SCREENS = [LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN]
const ALL_SCREENS = [LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN]

const SearchPage = testScreen => {
  if (!ALL_SCREENS.includes(testScreen)) {
    throw Error(`unknown screen size: >${testScreen}<`)
  }

  const getHiddenScreen = () => testScreen.suffix === SMALL_SCREEN.suffix
    ? LARGE_SCREEN
    : SMALL_SCREEN

  const getBrowserUrl = () => browser.driver.getCurrentUrl()
  const open = (path = '#!/search') => Promise.all([
    browser.get(path),
    browser.manage().window().setSize(testScreen.width, testScreen.height)
  ])

  const byUserId = (screen = testScreen) => by.id(`userId-${screen.suffix}`)
  const hasUserIdInput = screen => element(byUserId(screen)).isDisplayed()

  const userIdInput = () => element(byUserId())
  const getUserId = () => userIdInput().getAttribute('value')
  const setUserId = userId => userIdInput().sendKeys(userId)
  const formLabel = () => userIdInput().getAttribute('placeholder')

  const bySearchButton = (screen = testScreen) => by.id(`searchBtn-${screen.suffix}`)
  const searchButton = () => element(bySearchButton())
  const hasSearchButton = screen => element(bySearchButton(screen)).isDisplayed()
  const isSearchButtonEnabled = () => searchButton().isEnabled()

  const requestUserComments = userId => {
    setUserId(userId)
    searchButton().click()
  }

  const byUserName = (screen = testScreen) => by.id(`userName-${screen.suffix}`)
  const getUserName = () => element(byUserName()).getText()
  const hasUserName = screen => element(byUserName(screen)).isDisplayed()

  const byErrorMessage = by.id('errorMessage')
  const hasErrorMessage = () => browser.isElementPresent(byErrorMessage)
  const getErrorMessage = () => element(byErrorMessage).getText()

  const getComments = () => element.all(by.className('cmnt-box'))
    .map(createComment)

  const createComment = el => {
    const titleEl = el.element(by.className('cmnt-title'))
    const urlEl = el.element(by.className('cmnt-url'))
    const contentEl = el.element(by.className('cmnt-content'))
    const articleEl = el.element(by.className('cmnt-article'))
    return {
      title: titleEl.getText(),
      url: urlEl.getAttribute('ng-href'),
      content: contentEl.getText(),
      articleTitle: articleEl.getText(),
      articleUrl: articleEl.getAttribute('ng-href')
    }
  }

  return {
    getBrowserUrl,
    open,
    getHiddenScreen,
    hasUserIdInput,
    setUserId,
    getUserId,
    formLabel,
    hasSearchButton,
    isSearchButtonEnabled,
    requestUserComments,
    getUserName,
    hasUserName,
    hasErrorMessage,
    getErrorMessage,
    getComments
  }
}

module.exports = { SearchPage, LARGE_SCREEN, SMALL_SCREEN, ALL_SCREENS }
