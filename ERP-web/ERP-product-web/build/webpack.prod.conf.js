'use strict'
const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')()
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const testEnv = process.env.NODE_ENV === 'test_env'

console.log(testEnv);

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  // devtool: '#source-map',

  output: {
    path: testEnv ? path.resolve(__dirname, '../dist/test-env/') : process.env.NODE_ENV === 'test' ? path.resolve(__dirname, '../dist/') : path.resolve(__dirname, '../dist/erp/'),
    // 打包多出口文件
    filename: 'assets/js/[name].[hash].js',
    publicPath: testEnv ? '/test-env/' : process.env.NODE_ENV === 'test' ? '/' : '/erp/'
  },

	// devtool: process.env.NODE_ENV === 'test_env' ? 'cheap-module-eval-source-map' : false,
	devtool: false,

  plugins: [
		//删除dist目录
		new CleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '../'), //根目录
			verbose: true, //开启在控制台输出信息
			dry: false,
		}),
		new webpack.DefinePlugin({
			'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
		}),
		// 分离css插件参数为提取出去的路径
		// new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // both options are optional
    //   filename: 'assets/css/[name].[hash].css',
    //   chunkFilename: '[id].[hash].css',
    // }),
		new ExtractTextPlugin({
			filename: 'assets/css/[name].[hash:8].min.css',
		}),
		//压缩css
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true
			}
		}),
		//上线压缩 去除console等信息webpack4.x之后去除了webpack.optimize.UglifyJsPlugin
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
					warnings: false,
					drop_debugger: false,
					drop_console: true
				}
			}
		})
	]
})

module.exports = prodWebpackConfig