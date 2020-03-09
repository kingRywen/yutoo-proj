'use strict'

const {
  join,
  resolve
} = require('path')
const webpack = require('webpack')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = true
console.log(process.env.NODE_ENV)


module.exports = env => {

  const entries = {}
  const chunks = []
  const htmlWebpackPluginArray = []
  glob.sync('./src/pages/**/app.js').forEach(path => {
    const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
    entries[chunk] = ["babel-polyfill", path]
    chunks.push(chunk)

    const filename = chunk + '.html'
    const htmlConf = {
      filename: filename,
      template: path.replace(/.js/g, '.html'),
      inject: 'body',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        renderer: 'webkit',
        MobileOptimized: 'portrait',
        'x5-orientation': 'portrait',
        'full-screen': 'yes',
        'x5-fullscreen': 'true'
      },
      favicon: '',
      hash: true,
      chunks: ['commons', chunk]
    }
    htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
  })
  const config = {

    entry: entries,
    output: {
      path: resolve(__dirname, '../dist/'),
      filename: 'assets/js/[name].js',
      // publicPath: '/erp/' // 打包
      publicPath: process.env.NODE_ENV === 'production' ? '/' : '/'
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        'async-validator': 'async-validator/lib/index.js',
        'vue$': 'vue/dist/vue.esm.js',
        '@': join(__dirname, '../src'),
        assets: join(__dirname, '../src/assets'),
        common: join(__dirname, '../src/common'),
        apis: join(__dirname, '../src/apis'),
        components: join(__dirname, '../src/components')
      }
    },
    externals: {
      "UE": "UE",
      "XLSX": "XLSX"
    },
    module: {
      rules: [{
          test: /\.vue$/,
          loader: 'vue-loader',

        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: [/node_modules/, resolve(__dirname, '../static')]
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
            // 'less-loader'
          ],
        }, {
          test: /\.less$/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            // 'less-loader',
            {
              loader: 'less-loader',
              options: {
                // sourceMap: true,
                javascriptEnabled: true,
                modifyVars: require('./vue-beauty-override.json')
              }
            }
            // 'less-loader'
          ],
        }, {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              root: resolve(__dirname, 'src'),
              attrs: ['img:src', 'link:href']
            }
          }]
        },
        {
          test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          exclude: /favicon\.png$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/img/[name].[hash:7].[ext]'
            }
          }]
        }
      ]
    },
    optimization: {

      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 1,
            name: 'commons',
            enforce: true
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
          // default: false
        }
      }
    },
    performance: {
      hints: false
    },
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      // new MiniCssExtractPlugin({
      //   // Options similar to the same options in webpackOptions.output
      //   // both options are optional
      //   filename: devMode ? '[name].css' : '[name].[hash].css',
      //   chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      // })
    ]
  }
  config.plugins = [...config.plugins, ...htmlWebpackPluginArray]
  return config
}