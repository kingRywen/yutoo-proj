// import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'

import { UeEditor } from '@yutoo/yutoo'

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
import '../theme/index.css'
import VueLazyload from 'vue-lazyload'

// import 'Components'// 全局组件注册
import 'Directives' // 指令

// 引入插件
import router from '@/router/index'
import inject from 'Plugins/inject'
import store from '@/store/index'

import '@/assets/css/index.scss'
import '@/components'

import clipboard from 'clipboard'
//注册到vue原型上
Vue.prototype.clipboard = clipboard

// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()

Vue.use(inject)
Vue.use(ElementUI)
Vue.use(UeEditor)
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

Vue.prototype.$msg = function(msg, type = 'success') {
  let self = this
  self.$message({
    showClose: true,
    message: msg,
    type: type
  })
}

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
