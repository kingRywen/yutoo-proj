'use strict'
const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')()
const CopyWebpackPlugin = require('copy-webpack-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  watch: false,

  devServer: {
    stats: {
      errors: false,
      errorDetails: false,
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      warnings: false
    },
    // contentBase: path.join(__dirname, "static"),
    host: '192.168.0.139',
    open: true,
    compress: true,
    quiet: true,

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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: 'static',
      ignore: ['.*']
    }])
  ]
})

console.log(process.env.NODE_ENV)

module.exports = devWebpackConfig