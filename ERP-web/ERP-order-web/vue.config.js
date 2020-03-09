var path = require('path')
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
var lfEvent = process.env.npm_lifecycle_event

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  baseUrl:
    lfEvent === 'build:online'
      ? '/erp/erp-order'
      : lfEvent === 'build:test'
      ? '/test-env/erp-order'
      : '/erp-order',
  outputDir:
    lfEvent === 'build:online'
      ? 'dist/erp/erp-order'
      : lfEvent === 'build:test'
      ? 'dist/test-env/erp-order'
      : 'dist/erp-order',
  productionSourceMap: lfEvent === 'build:online' ? false : true,
  devServer: {
    open: true,
    quiet: true
  },
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      UE: 'UE',
      clipboard: 'ClipboardJS'
    }
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // 引入全局sass变量
        data: `@import "@/assets/style/base/variables.scss";`
      }
    }
  },

  // 修改webpack配置
  chainWebpack: config => {
    // 别名
    config.resolve.alias
      .set('Views', resolve('src/views'))
      .set('Store', resolve('src/store'))
      .set('Utils', resolve('src/utils'))
      .set('Config', resolve('src/config'))
      .set('Routes', resolve('src/routes'))
      .set('Assets', resolve('src/assets'))
      .set('Service', resolve('src/service'))
      .set('Plugins', resolve('src/plugins'))
      .set('Components', resolve('src/components'))
      .set('Directives', resolve('src/directives'))

    config.plugin('friendly').use(FriendlyErrorsWebpackPlugin)
  },

  // vue echarts引入的时候必须设置此项
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
    // '@yutoo/yutoo'
  ]
}
