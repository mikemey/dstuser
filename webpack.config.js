const path = require('path')

module.exports = {
  entry: './frontend/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'frontend-dist')
  }
}
