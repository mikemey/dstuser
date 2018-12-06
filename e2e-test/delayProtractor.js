const { browser, promise } = require('protractor')
const origFn = browser.driver.controlFlow().execute

module.exports = delay => {
  browser.driver.controlFlow().execute = function () {
    const args = arguments

    origFn.call(browser.driver.controlFlow(), function () {
      return promise.delayed(delay)
    })

    return origFn.apply(browser.driver.controlFlow(), args)
  }
}
