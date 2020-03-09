const path = require('path');
const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

function resolve(_path) {
  return path.resolve(process.cwd(), _path)
}

const webpackConfig = {
  // entry: './examples/entry.js',
  mode: 'production',
  // output: {
  //   path: resolve('./examples/dist/'),
  //   filename: '[name].[hash].js',
  //   publicPath: '/'
  // },
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new ProgressBarPlugin(),
  // ],
  // optimization: {
  //   minimizer: []
  // },
  // devtool: '#eval-source-map'
}

module.exports = webpackConfig