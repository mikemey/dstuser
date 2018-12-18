const { by, browser, element } = require('protractor')

const comments = require('./comments.page')
const { hasElement, onlyDisplayed, asNumber, setInputField } = require('../utils/utils.page')

// large screen -> xxx-small element identifiers
const LARGE_SCREEN = { id: 'LARGE SCREEN', width: 1000, height: 800, suffix: 'small' }
// medium screen -> xxx-large element identifiers
const MEDIUM_SCREEN = { id: 'MEDIUM SCREEN', width: 720, height: 600, suffix: 'large' }
// small screen -> xxx-large element identifiers
const SMALL_SCREEN = { id: 'SMALL SCREEN', width: 540, height: 500, suffix: 'large' }

// const ALL_SCREENS = [LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN]
const ALL_SCREENS = [LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN]

const SearchPage = testScreen => {
  if (!ALL_SCREENS.includes(testScreen)) {
    throw Error(`unknown screen size: >${testScreen}<`)
  }

  const getHiddenScreen = () => testScreen === LARGE_SCREEN
    ? SMALL_SCREEN
    : LARGE_SCREEN

  const getBrowserUrl = () => browser.driver.getCurrentUrl()

  const userSearchPath = '#!/search'
  const openUserPage = userId => open(`${userSearchPath}/${userId}`)
  const open = (path = userSearchPath) => browser.get(path)
    .then(() => browser.manage().window().setSize(testScreen.width, testScreen.height))

  const restart = () => browser.getAllWindowHandles()
    .then(handles => {
      if (handles[1]) {
        browser.driver.switchTo().window(handles[1])
        browser.driver.close()
      }
      browser.driver.switchTo().window(handles[0])
    })

  const byUserId = (screen = testScreen) => by.id(`userId-${screen.suffix}`)
  const hasUserIdInput = screen => hasElement(byUserId(screen))

  const userIdInput = () => element(byUserId())
  const getUserId = () => userIdInput().getAttribute('value')
  const sendToUserId = userId => setInputField(userIdInput(), userId)
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

  const byFilter = (screen = testScreen) => by.id(`filter-${screen.suffix}`)
  const hasFilter = screen => hasElement(byFilter(screen))
  const filterInput = () => element(byFilter())
  const isFilterEnabled = () => filterInput().isEnabled()
  const sendToFilter = filter => setInputField(filterInput(), filter)

  const byKarma = type => by.className(`karma-${type}`)
  const karmaPoints = type => element.all(byKarma(type))
    .filter(onlyDisplayed)
    .first().getText().then(asNumber)
  const getKarmaPoints = () => Promise.all([karmaPoints('pos'), karmaPoints('neg')])
  const hasKarma = () => Promise.all([hasElement(byKarma('pos')), hasElement(byKarma('neg'))])
    .then(karmas => karmas[0] && karmas[1])

  /* eslint object-property-newline: "off" */
  return {
    id: testScreen.id,
    getBrowserUrl,
    open,
    restart,
    openUserPage,
    getHiddenScreen,
    hasUserIdInput, sendToUserId, getUserId,
    formLabel,
    hasSearchButton, isSearchButtonEnabled,
    requestUserComments,
    getUserName, hasUserName,
    hasErrorMessage, getErrorMessage,
    hasFilter, isFilterEnabled, sendToFilter,
    comments,
    hasKarma, getKarmaPoints
  }
}

module.exports = { SearchPage, LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN, ALL_SCREENS }
