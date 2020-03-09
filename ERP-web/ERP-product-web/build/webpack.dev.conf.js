// 'use strict'
const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')()
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const single_env = process.env.SINGLE_ENV == 1

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/',
    // 打包多出口文件
    filename: 'assets/js/[name].bundle.js'
    // pathinfo: false
  },

  devServer: {
    contentBase: path.join(__dirname, '../src'),
    publicPath: '/',
    stats: 'errors-only',
    host: '192.168.0.144',
    open: true,
    quiet: true,
    hot: true,

    port: single_env ? 8018 : 8019,
    // historyApiFallback: false,
    noInfo: true
    // proxy: {
    //   '/v1/api': {
    //     target: 'http://localhost:3005',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/v1/api': ''
    //     }
    //   }
    // }
  },
  // optimization: {
  //   removeAvailableModules: false,
  //   removeEmptyChunks: false,
  //   splitChunks: false,
  // },

  plugins: [
    //热更新
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': '"' + process.env.BASE_URL + '"'
    })
  ]
})

// console.log(JSON.stringify(devWebpackConfig));

module.exports = devWebpackConfig
