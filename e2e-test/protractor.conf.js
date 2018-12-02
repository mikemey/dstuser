const configLoader = require('../backend/configLoader')
process.env.NODE_ENV = 'E2E'
const serverPort = configLoader.get(console).port

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['**/**.spec.js'],
  baseUrl: `http://localhost:${serverPort}/dstu/`
}
