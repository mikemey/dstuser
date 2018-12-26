const { by, browser, element } = require('protractor')

const comments = require('./comments.page')
const {
  asHref, asText,
  hasElement, onlyDisplayed, asNumber, setInputField,
  waitForElementText, waitForElementNumber, waitForElementInvisible, waitForElementClick
} = require('../utils/utils.page')

// large screen -> xxx-small element identifiers
const LARGE_SCREEN = { id: 'LARGE SCREEN', width: 1000, height: 700, suffix: 'small' }
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
  const open = (path = userSearchPath) => browser.manage().window().setSize(testScreen.width, testScreen.height)
    .then(() => browser.manage().window().setPosition(0, 0))
    .then(() => browser.get(path))

  const restart = () => browser.getAllWindowHandles()
    .then(handles => {
      if (handles[1]) {
        browser.driver.switchTo().window(handles[1])
        browser.driver.close()
      }
      browser.driver.switchTo().window(handles[0])
    })

  const userId = (screen = testScreen) => `userId-${screen.suffix}`
  const byUserId = screen => by.id(userId(screen))
  const hasUserIdInput = screen => hasElement(byUserId(screen))

  const userIdInput = () => element(byUserId())
  const getUserId = () => userIdInput().getAttribute('value')
  const sendToUserId = userId => setInputField(byUserId(), userId)
  const formLabel = () => userIdInput().getAttribute('placeholder')

  const bySearchButton = (screen = testScreen) => by.id(`searchBtn-${screen.suffix}`)
  const searchButton = () => element(bySearchButton())
  const hasSearchButton = screen => hasElement(bySearchButton(screen))
  const isSearchButtonEnabled = () => searchButton().isEnabled()

  const requestUserComments = userId => sendToUserId(userId).then(() => searchButton().click())

  const byUserName = (screen = testScreen) => by.id(`userName-${screen.suffix}`)
  const hasUserName = screen => hasElement(byUserName(screen))
  const getUserName = () => waitForElementText(byUserName())

  const byErrorMessage = (screen = testScreen) => by.id(`errorMessage-${screen.suffix}`)
  const hasErrorMessage = screen => hasElement(byErrorMessage(screen))
  const getErrorMessage = () => waitForElementText(byErrorMessage())

  const filterId = (screen = testScreen) => `filter-${screen.suffix}`
  const byFilter = (screen = testScreen) => by.id(filterId(screen))
  const hasFilter = screen => hasElement(byFilter(screen))
  const filterInput = () => element(byFilter())
  const isFilterEnabled = () => filterInput().isEnabled()
  const sendToFilter = filter => setInputField(byFilter(), filter)

  const byKarma = type => by.css(`user-stats *[class~=karma-${type}]`)
  const karmaPoints = type => element.all(byKarma(type))
    .filter(onlyDisplayed)
    .first().getText().then(asNumber)
  const getKarmaTotal = () => Promise.all([karmaPoints('pos'), karmaPoints('neg')])
  const hasKarmaTotal = () => Promise.all([hasElement(byKarma('pos')), hasElement(byKarma('neg'))])
    .then(karmas => karmas[0] && karmas[1])

  const byTotal = by.className('postings-total')
  const hasPostingTotal = () => hasElement(byTotal)
  const getPostingTotal = () => waitForElementNumber(byTotal)

  const getPartsLoaded = () => waitForElementNumber(by.className('parts-loaded'))
  const getPartsTotal = () => waitForElementNumber(by.className('parts-total'))

  const byLoader = by.className('loader')
  const waitForPostingsLoaded = () => waitForElementInvisible(byLoader)

  const byMorePostingsButton = by.id('more-postings')
  const hasMorePostingsButton = () => hasElement(byMorePostingsButton)
  const clickMorePostingsButton = () => waitForElementClick(byMorePostingsButton)
  const getMorePostingsButtonLabel = () => waitForElementText(byMorePostingsButton)

  const hasPostingPages = () => hasElement(by.className('posting-pages'))
  const postingPages = () => element.all(by.css('.posting-pages a')).filter(onlyDisplayed)
  const getPostingPagesLinks = () => postingPages().map(el => asHref(el))
  const getPostingPagesNumbers = () => postingPages().map(anchor => asText(anchor).then(asNumber))

  /* eslint object-property-newline: "off" */
  return {
    id: testScreen.id,
    getBrowserUrl,
    open,
    restart,
    openUserPage,
    getHiddenScreen,
    userId, hasUserIdInput, sendToUserId, getUserId,
    formLabel,
    hasSearchButton, isSearchButtonEnabled,
    requestUserComments,
    getUserName, hasUserName,
    hasErrorMessage, getErrorMessage,
    filterId, hasFilter, isFilterEnabled, sendToFilter,
    comments,
    hasKarmaTotal, getKarmaTotal,
    hasPostingTotal, getPostingTotal,
    getPartsLoaded, getPartsTotal,
    waitForPostingsLoaded,
    hasMorePostingsButton, clickMorePostingsButton, getMorePostingsButtonLabel,
    hasPostingPages, getPostingPagesNumbers, getPostingPagesLinks
  }
}

module.exports = { SearchPage, LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN, ALL_SCREENS }
