var path = require('path')

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

let dist = process.env.VUE_APP_TEST ? 'league-agent' : 'league-agent'

module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ?
    `/${dist}/` : '/',
  outputDir: `dist/${dist}`,
  productionSourceMap: false,
  devServer: {

    open: true,
    quiet: true,
  },
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

  configureWebpack: {
    externals: {
      // "vue": "Vue",
      // "vuex": "Vuex",
      // "vue-router": "VueRouter",
      // "element-ui": "ELEMENT",
      // "vue-lazyload": "VueLazyload",
      // "clipboard": "ClipboardJS",
      // "axios": "axios",
      "UE": 'UE'
    }
  },


  // 修改webpack配置
  chainWebpack: (config) => {
    config.plugin('copy').tap(args => {
      // 忽略文件夹后面必须带 /**
      args[0][0].ignore.push('static/**')
      args[0][0].ignore.push('editor/**')
      return args
    })
    config.module.rule('svg').exclude.add(resolve('src/assets/svg')).end()

    // 添加SVG loader
    config.module
      .rule('svg-smart')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
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
      .set('Layouts', resolve('src/layouts'))
      .set('Directives', resolve('src/directives'))
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },

  // vue echarts 依赖
  // transpileDependencies: [
  //   /\/node_modules\/vue-echarts\//,
  //   /\/node_modules\/resize-detector\//
  // ]
}