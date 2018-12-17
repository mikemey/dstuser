const { browser, element } = require('protractor')

const onlyDisplayed = el => el.isDisplayed()
const asText = el => el.getText()
const asHref = (el, attrName = 'href') => el.getAttribute(attrName)
const asNumber = res => {
  const num = Number(res)
  if (isNaN(num)) console.log(`NaN: [${res}]`)
  return num
}

const hasElement = byElement => browser
  .isElementPresent(byElement)
  .then(isElementPresent => isElementPresent
    ? element(byElement).isDisplayed()
    : Promise.resolve(false)
  )

module.exports = { onlyDisplayed, asText, asHref, asNumber, hasElement }
