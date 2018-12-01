exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['ee-test/**.spec.js'],
  baseUrl: 'http://localhost:7000/dstu/'
}
