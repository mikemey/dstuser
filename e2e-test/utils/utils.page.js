const { element, browser, ExpectedConditions } = require('protractor')
const EC = ExpectedConditions

const onlyDisplayed = el => el.isDisplayed()
const asText = el => el.getText()
const asHref = (el, attrName = 'href') => el.getAttribute(attrName)
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

const waitForElementInvisible = byElement => browser.wait(EC.invisibilityOf(element(byElement)))

const waitForElementClick = byElement => waitForElement(byElement).then(() => {
  const el = element(byElement)
  browser.executeScript('arguments[0].scrollIntoView()', el.getWebElement())
  return el.click()
})

const activeElementId = () => browser.driver.switchTo().activeElement().getAttribute('id')

module.exports = {
  onlyDisplayed,
  asText,
  asHref,
  asNumber,
  hasElement,
  waitForElementClick,
  setInputField,
  waitForElement,
  waitForVisibleElements,
  waitForElementText,
  waitForElementNumber,
  waitForElementInvisible,
  activeElementId
}
