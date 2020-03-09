var path = require('path')
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/assets/style/base/variables.less') // 需要全局导入的less
      ],
    })
}

module.exports = {
  lintOnSave: false,
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/shop/'
    : '/',
  outputDir: 'dist',
  productionSourceMap: false,
  css: {
    sourceMap: true,
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // 引入全局sass变量
        data: `@import "@/assets/style/base/variables.scss";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },


  // 修改webpack配置
  chainWebpack: (config) => { // 别名
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
      .set('Layouts', resolve('src/layouts'))
      .set('Directives', resolve('src/directives'))
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  // vue echarts 依赖
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}