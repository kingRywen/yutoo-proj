import '@babel/polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueLazyload from 'vue-lazyload'
import '../theme/index.css'
import '@/assets/icon/iconfont.css'
import yutoo from '@yutoo/yutoo'
import 'Components'// 全局组件注册
import 'Directives' // 指令
import App from './App.vue'

// 引入插件
import inject from 'Plugins/inject'
import store from '@/store/index'
import router from '@/router/index'
import '@/assets/css/index.scss'

import VueECharts from 'vue-echarts'
Vue.component('v-chart', VueECharts)

// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()

Vue.use(inject)
Vue.use(yutoo)
Vue.use(ElementUI, {
  size: 'small'
})
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = 'ERP产品库 - ' + to.meta.title
  }
  next()
})

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2
})

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
