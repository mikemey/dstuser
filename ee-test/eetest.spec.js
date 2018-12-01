const { by, browser, element } = require('protractor')

describe('DSTU main page', function () {
  it('should show greeting message', function () {
    browser.get('./')

    const greeter = element(by.id('greeting'))
    expect(greeter.getText()).toEqual('hello: can you see me?')
  })
})
