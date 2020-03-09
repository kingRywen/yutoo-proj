'use strict'
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, "static"),
    host: '192.168.0.126',
    port: 8019,
    historyApiFallback: false,
    noInfo: true,
    proxy: {
      '/v1/api': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        pathRewrite: {
          '^/v1/api': ''
        }
      }
    }
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: 'static',
      ignore: ['.*']
    }])
  ]
})

module.exports = devWebpackConfig