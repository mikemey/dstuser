const { element, browser, ExpectedConditions } = require('protractor')
const EC = ExpectedConditions

const onlyDisplayed = el => el.isDisplayed()
const getText = el => el.getText()
const getTextAsNumber = el => el.getText().then(asNumber)
const getHref = (el, attrName = 'href') => el.getAttribute(attrName)
const asNumber = res => {
  const num = Number(res)
  if (isNaN(num)) console.log(`NaN: [${res}]`)
  return num
}

const hasElement = byElement => element.all(byElement)
  .filter(onlyDisplayed).first().isPresent()

const setInputField = (byElement, text) => waitForElement(byElement)
  .then(() => element(byElement).clear())
  .then(() => element(byElement).sendKeys(text))

const waitForElement = (byElement, locator = element) => browser
  .wait(EC.presenceOf(locator(byElement)), 3000)

const waitForVisibleElements = byElement => waitForElement(byElement, element.all)
  .then(() => element.all(byElement).filter(onlyDisplayed))

const waitForElementText = byElement => waitForVisibleElements(byElement).then(elements => {
  if (elements.length !== 1) {
    const msg = `Expected exactly 1 matching element for: ${byElement}, matches found: ${elements.length}`
    throw Error(msg)
  }
  return elements[0].getText()
})

const waitForElementNumber = byElement => waitForElementText(byElement).then(asNumber)

const waitForElementClick = byElement => waitForElement(byElement).then(() => {
  const el = element(byElement)
  browser.executeScript('arguments[0].scrollIntoView()', el.getWebElement())
  return el.click()
})

const waitForTextPresent = (byElement, text) => {
  const visibleEl = element.all(byElement).filter(onlyDisplayed).get(0)
  return browser.wait(EC.textToBePresentInElement(visibleEl, text))
}

const activeElementId = () => browser.driver.switchTo().activeElement().getAttribute('id')

module.exports = {
  onlyDisplayed,
  getText,
  getTextAsNumber,
  getHref,
  asNumber,
  hasElement,
  waitForElementClick,
  setInputField,
  waitForElement,
  waitForVisibleElements,
  waitForElementText,
  waitForElementNumber,
  waitForTextPresent,
  activeElementId
}
