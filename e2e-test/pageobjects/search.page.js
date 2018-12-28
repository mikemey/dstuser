const { by, browser, element } = require('protractor')

const comments = require('./comments.page')
const {
  getHref, getTextAsNumber,
  hasElement, onlyDisplayed, setInputField,
  waitForElementText, waitForElementNumber, waitForTextPresent, waitForElementClick
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

  const byFilter = (screen = testScreen) => by.id(`filter-${screen.suffix}`)
  const hasFilter = screen => hasElement(byFilter(screen))
  const filterInput = () => element(byFilter())
  const isFilterEnabled = () => filterInput().isEnabled()
  const sendToFilter = filter => setInputField(byFilter(), filter)

  const byKarma = type => by.css(`user-stats *[class~=karma-${type}]`)
  const karmaPoints = type => element.all(byKarma(type))
    .filter(onlyDisplayed)
    .first().getText()
  const getKarmaTotal = () => Promise.all([karmaPoints('pos'), karmaPoints('neg')])
  const hasKarmaTotal = () => Promise.all([hasElement(byKarma('pos')), hasElement(byKarma('neg'))])
    .then(karmas => karmas[0] && karmas[1])

  const byTotal = by.className('postings-total')
  const hasPostingTotal = () => hasElement(byTotal)
  const getPostingTotal = () => waitForElementText(byTotal)

  const byPercentageLoaded = by.className('pct-loaded')
  const getPercentageLoaded = () => waitForElementNumber(byPercentageLoaded)
  const waitForPostingsLoaded = () => waitForTextPresent(byPercentageLoaded, 100)

  const byMorePostingsButton = (direction = 'tail') => by.id(`more-postings-${direction}`)
  const hasMorePostingsButton = direction => hasElement(byMorePostingsButton(direction))
  const clickMorePostingsButton = direction => waitForElementClick(byMorePostingsButton(direction))
  const getMorePostingsButtonLabel = direction => waitForElementText(byMorePostingsButton(direction))

  const postingPagesClass = 'posting-pages'
  const hasPostingPages = () => hasElement(by.className(postingPagesClass))
  const postingPages = () => element.all(by.css(`.${postingPagesClass} li:not(.disabled) a`))
  const getPostingPagesLinks = () => postingPages().map(el => getHref(el))
  const getPostingPagesNumbers = () => postingPages().map(getTextAsNumber)
  const clickPostingPageLink = pageNum => element(by.cssContainingText('.page-link', `${pageNum}`)).click()
  const getActivePostingPagesLinks = () => element.all(by.css(`.${postingPagesClass} li.current a`)).map(getTextAsNumber)

  /* eslint object-property-newline: "off" */
  return {
    id: testScreen.id,
    getBrowserUrl,
    open,
    openUserPage,
    getHiddenScreen,
    userId, hasUserIdInput, sendToUserId, getUserId,
    formLabel,
    hasSearchButton, isSearchButtonEnabled,
    requestUserComments,
    getUserName, hasUserName,
    hasErrorMessage, getErrorMessage,
    hasFilter, isFilterEnabled, sendToFilter,
    comments,
    hasKarmaTotal, getKarmaTotal,
    hasPostingTotal, getPostingTotal,
    getPercentageLoaded,
    waitForPostingsLoaded,
    hasMorePostingsButton, clickMorePostingsButton, getMorePostingsButtonLabel,
    hasPostingPages, getPostingPagesNumbers, getPostingPagesLinks, clickPostingPageLink, getActivePostingPagesLinks
  }
}

module.exports = { SearchPage, LARGE_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN, ALL_SCREENS }
