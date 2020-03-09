var path = require('path')
var lfEvt = process.env.npm_lifecycle_event

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  baseUrl:
    lfEvt === 'build:online'
      ? '/erp/erp-customer'
      : lfEvt === 'build:test'
      ? '/test-env/erp-customer'
      : '/erp-customer',
  outputDir:
    lfEvt === 'build:online'
      ? 'dist/erp/erp-customer'
      : lfEvt === 'build:test'
      ? 'dist/test-env/erp-customer'
      : 'dist/erp-customer',
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      UE: 'UE',
      clipboard: 'ClipboardJS',
      lodash: 'lodash'
    }
  },
  devServer: {
    open: true
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
  }
}
