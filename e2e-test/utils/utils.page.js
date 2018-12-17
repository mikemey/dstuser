const { element } = require('protractor')

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

module.exports = { onlyDisplayed, asText, asHref, asNumber, hasElement }
