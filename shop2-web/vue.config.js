var path = require('path')
var lfEvent = process.env.npm_lifecycle_event
var FOLDER_NAME = {
  online: '/shop2',
  test: '/shop2',
  normal: '/shop2'
}
// module.exports.FOLDER_NAME = FOLDER_NAME

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
// console.log(process.env.BABEL_ENV === 'test');

const configureWebpack =
  process.env.NODE_ENV === 'production' ? {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      // 'vue-echarts': 'VueECharts',
      'vue-lazyload': 'VueLazyload',
    }
  } : {
      externals: {
        // 'vue-echarts': 'VueECharts',
      }
    }

module.exports = {
  lintOnSave: false,
  publicPath: process.env.VUE_APP_PACKAGE_ENV === 'online' ?
    FOLDER_NAME.online : lfEvent === 'build:test' ?
      FOLDER_NAME.test : FOLDER_NAME.normal,
  outputDir: process.env.VUE_APP_PACKAGE_ENV === 'online' ?
    `dist${FOLDER_NAME.online}` : lfEvent === 'build:test' ?
      `dist${FOLDER_NAME.test}` : `dist${FOLDER_NAME.normal}`,
  productionSourceMap: false,
  devServer: {
    open: true,
    quiet: true
  },
  configureWebpack,
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
  // vue echarts引入的时候必须设置此项
  // transpileDependencies: [
  //   /\/node_modules\/vue-echarts\//,
  //   /\/node_modules\/resize-detector\//
  // ]
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
      .set('Layout', resolve('src/Layout'))
      .set('Service', resolve('src/service'))
      .set('Plugins', resolve('src/plugins'))
      .set('Components', resolve('src/components'))
      .set('Directives', resolve('src/directives'))
  }
}
