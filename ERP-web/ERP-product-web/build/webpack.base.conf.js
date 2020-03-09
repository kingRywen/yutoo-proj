'use strict'

const {
  join,
  resolve
} = require('path')
const webpack = require('webpack')
const glob = require('glob')
// html模板
const HtmlWebpackPlugin = require('html-webpack-plugin')
//静态资源输出
const CopyWebpackPlugin = require("copy-webpack-plugin");
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const rules = require("./webpack.rules.conf.js");

const single_env = process.env.SINGLE_ENV == 1

console.log(single_env);

module.exports = () => {

  let entries = {}
  let chunks = []
  let htmlWebpackPluginArray = []
  if (!single_env) {
    glob.sync('./src/pages/**/app.js').forEach(path => {
      const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
      entries[chunk] = ["babel-polyfill", path]
      chunks.push(chunk)
  
      const filename = chunk + '.html'
      const htmlConf = {
        filename: filename,
        template: path.replace(/.js/g, '.html'),
        // template: resolve(__dirname, '../src/template.html'),
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
        chunks: ['manifest','vendor', 'commons', chunk],
        minify: process.env.NODE_ENV !== "production" ? false : {
          removeComments: true, //移除HTML中的注释
          collapseWhitespace: true, //折叠空白区域 也就是压缩代码
          removeAttributeQuotes: true, //去除属性引用
        },
      }
      htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
    })
  } else {
    entries = {
      // 'index': ['babel-polyfill','./src/single/app.js'],
      'login': ['babel-polyfill', './src/pages/login/app.js'],
      'index1': ['babel-polyfill', './src/pages/product/ShopProducts/upInfomation/app.js'],
      'index': ['babel-polyfill', './src/pages/product/platformList/ebayEditLists/app.js'],
      'list': ['babel-polyfill', './src/pages/product/platformList/viewProduct/app.js'],
      
    }
    for (const key in entries) {
      if (entries.hasOwnProperty(key)) {
        htmlWebpackPluginArray.push(new HtmlWebpackPlugin({
          filename: key + '.html',
          template: join(__dirname, '../src/template.html'),
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
          chunks: ['manifest','vendor', 'common', key],
          minify: process.env.NODE_ENV !== "production" ? false : {
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true, //折叠空白区域 也就是压缩代码
            removeAttributeQuotes: true, //去除属性引用
          },
        }))
      }
    }
    
  }
  // console.log(entries);
  
  const config = {

    entry: entries,
    output: {
      path: resolve(__dirname, '../dist/'),
      filename: 'assets/js/[name].[hash].js',
      // publicPath: '/erp/' // 打包/
      publicPath: '/'
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
      "XLSX": "XLSX",
      // "Vue": 'vue',
      // "ELEMENT": 'element-ui',
      // "VueRouter": 'vue-router',
      // "Vuex": "vuex",
      // "vueBeauty": 'vue-beauty'
    },
    module: {
      rules: [...rules]
    },
    // 提取公共代码
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks: {
        cacheGroups: {
          vendor: { // 抽离第三方插件
            test: /node_modules/, // 指定是node_modules下的第三方包
            chunks: 'initial',
            name: 'vendor', // 打包后的文件名，任意命名    
            // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
            priority: 10
          },

          utils: { // 抽离自己写的公共代码，common这个名字可以随意起
            chunks: 'initial',
            name: 'commons', // 任意命名
            minSize: 0, // 只要超出0字节就生成一个新包
            minChunks: 2
          }
        }
      }
    },

    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      //静态资源输出
      new CopyWebpackPlugin([{
        from: resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }]),

      // new MiniCssExtractPlugin({
      //   filename: devMode ? '[name].css' : '[name].[hash].css',
      //   chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      // }),
      // 消除冗余的css代码
      new purifyCssWebpack({
        paths: glob.sync(join(__dirname, "../src/pages/**.html"))
      })

    ]
  }
  config.plugins = [...config.plugins, ...htmlWebpackPluginArray]
  if (process.env.NODE_ENV === 'production' && process.env.npm_config_report) {
    config.plugins.push(new BundleAnalyzerPlugin())
  }
  // console.log(config);
  return config
}