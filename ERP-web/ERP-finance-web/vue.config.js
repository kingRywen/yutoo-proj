var path = require('path')
var lfEvent = process.env.npm_lifecycle_event

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

const configureWebpack =
  process.env.NODE_ENV === 'production'
    ? {
        externals: {
          vue: 'Vue',
          vuex: 'Vuex',
          'vue-router': 'VueRouter',
          'element-ui': 'ELEMENT',
          axios: 'axios',
          // 'fabric': 'fabric',
          'vue-echarts': 'VueECharts',
          'vue-lazyload': 'VueLazyload',
          clipboard: 'ClipboardJS',
          UE: 'UE'
        }
      }
    : {
        externals: {
          UE: 'UE',
          'vue-echarts': 'VueECharts',
        }
      }

console.log(configureWebpack)

module.exports = {
  baseUrl:
    process.env.VUE_APP_PACKAGE_ENV === 'online'
      ? '/erp/erp-finance'
      : lfEvent === 'build:test'
      ? '/test-env/erp-finance'
      : '/erp-finance',
  outputDir:
    process.env.VUE_APP_PACKAGE_ENV === 'online'
      ? 'dist/erp/erp-finance'
      : lfEvent === 'build:test'
      ? 'dist/test-env/erp-finance'
      : 'dist/erp-finance',
  productionSourceMap: false,
  devServer: {
    open: true,
    quiet: true
  },
  configureWebpack,
  // configureWebpack: {
  //   externals: {
  //     vue: 'Vue',
  //     vuex: 'Vuex',
  //     'vue-router': 'VueRouter',
  //     'element-ui': 'ELEMENT',
  //     axios: 'axios',
  //     UE: 'UE',
  //     clipboard: 'ClipboardJS'
  //   }
  // },
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
  }

  // vue echarts引入的时候必须设置此项
  // transpileDependencies: [
  //   /\/node_modules\/vue-echarts\//,
  //   /\/node_modules\/resize-detector\//
  // ]
}
