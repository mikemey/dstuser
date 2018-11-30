const { by, browser, element } = require('protractor')

describe('angularjs homepage todo list', function () {
  it('should add a todo', function () {
    browser.get('https://angularjs.org')

    element(by.model('todoList.todoText')).sendKeys('write first protractor test')
    element(by.css('[value="add"]')).click()

    const todoList = element.all(by.repeater('todo in todoList.todos'))
    expect(todoList.count()).toEqual(3)
    expect(todoList.get(2).getText()).toEqual('write first protractor test')

    todoList.get(2).element(by.css('input')).click()
    const completedAmount = element.all(by.css('.done-true'))
    expect(completedAmount.count()).toEqual(2)
  })
})
