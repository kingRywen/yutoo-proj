import '@babel/polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueLazyload from 'vue-lazyload'
import Clipboard from 'vue-clipboard2'
import '../theme/index.css'
import 'Utils/$.js'

import 'Components' // 全局组件注册
// import YutooComponent from '@yutoo/erp2-components'
import 'Directives' // 指令
import App from './App.vue'
import * as config from 'Config';
import Interceptors from 'Config/interceptors';
// 引入插件
import inject from '@yutoo/utils';
import yutoo from '@yutoo/yutoo'
import store from '@/store/index'
import router from '@/router/index'
import '@/assets/css/index.scss'
import mixins from './mixins';
// import '@yutoo/erp2-components/dist/erp2-components.css';

import 'animate.css';

import VueECharts from 'vue-echarts'
import myNpmUtils from './utils/toolsFn'
Vue.component('v-chart', VueECharts)
Vue.mixin(mixins)

myNpmUtils(Vue)

// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()

Vue.use(Clipboard)
Vue.use(inject, {
  ...config,
  Interceptors,
  STORAGE_NAME: 'ERP_PRODUCT'
})
Vue.use(yutoo)
Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.title || to.name) {
    document.title = 'ERP产品库 - ' + (to.meta.title || to.name)
  }
  next()
})

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')