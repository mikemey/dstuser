const fs = require('fs')
const path = require('path')

const testDataDir = './comments'

const TestDataLoader = {
  testData: filename => fs.readFileSync(path.join(__dirname, testDataDir, filename), 'utf8'),
  testDataAsJson: filename => require(`${testDataDir}/${filename}`)
}

module.exports = TestDataLoader
