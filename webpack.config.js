const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isTest = process.env.npm_lifecycle_event.includes('test')
const isProd = process.env.NODE_ENV === 'PROD'

module.exports = {
  stats: 'minimal',
  entry: isTest ? undefined : { app: './frontend/app/app.js' },
  mode: (isTest || !isProd) ? 'development' : 'production',
  output: isTest ? {}
    : {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js'
    },
  module: {
    rules: [
      { test: /\.css$/, use: isTest ? 'null-loader' : ['style-loader', CssExtractPlugin.loader, 'css-loader'] },
      { test: /\.html$/, use: 'raw-loader' }
    ]
  },
  plugins: isTest ? []
    : [
      new CleanWebpackPlugin('dist', {}),
      new HtmlWebpackPlugin({ template: './frontend/public/index.html', inject: 'body' }),
      new CssExtractPlugin({ filename: 'css/[name].css', allChunks: true }),
      new webpack.NoEmitOnErrorsPlugin(),
      new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'frontend', 'public') }])
    ]
}
