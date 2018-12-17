const { element, browser } = require('protractor')

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

const elementInView = byElement => {
  const el = element(byElement)
  browser.executeScript('arguments[0].scrollIntoView()', el.getWebElement())
  return el
}

module.exports = {
  onlyDisplayed,
  asText,
  asHref,
  asNumber,
  hasElement,
  elementInView
}
