'use strict'
const merge = require('webpack-merge')
const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const prodWebpackConfig = merge(baseWebpackConfig, {
  devtool: '#source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          warnings: false,
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      }
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: 'static',
      ignore: ['.*']
    }]),
    new CleanWebpackPlugin(
      ['dist'], {
        root: path.resolve(__dirname, '../'),
        // exclude: [path.resolve(__dirname, '../dist/static')],
        verbose: true,
        dry: false
      })
  ]
})

module.exports = prodWebpackConfig