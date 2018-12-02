const sinon = require('sinon')

const appToMock = require('../backend/app')
const configLoaderToMock = require('../backend/configLoader')
const logger = require('../backend/utils/winstonLogger')

describe('server start', () => {
  it('should call createServer with provided configuration file', () => {
    const configObj = { some: 'configuration' }
    const dummyLogger = { info: () => { } }

    sinon.stub(logger, 'create').returns(dummyLogger)
    sinon.stub(appToMock, 'createServer').resolves()
    sinon.stub(configLoaderToMock, 'get').returns(configObj)

    require('../backend/index')

    sinon.assert.calledOnce(configLoaderToMock.get)
    sinon.assert.calledWith(appToMock.createServer, configObj, dummyLogger)
    configLoaderToMock.get.restore()
    appToMock.createServer.restore()
    logger.create.restore()
  })
})
