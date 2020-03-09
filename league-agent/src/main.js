import '@babel/polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueLazyload from 'vue-lazyload'
import Clipboard from 'vue-clipboard2'
import '../theme/index.css'
import 'Components' // 全局组件注册
import 'Directives' // 指令
import App from './App.vue'
import * as config from 'Config';
import Interceptors from 'Config/interceptors';
// 引入插件
import inject from '@yutoo/utils';
import store from '@/store/index'
import router from '@/router/index'
import '@/assets/css/index.scss'
import mixins from './mixins';
import 'animate.css';
Vue.mixin(mixins)

if (process.env.NODE_ENV === 'development') {
  Vue.prototype.$log = window.console.log;
}

// 引入svg图像
const requireAll = requireContext => requireContext.keys().map(requireContext);
// import all svg
const req = require.context('./assets/svg', true, /\.svg$/);
requireAll(req);

// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()
Vue.use(Clipboard)
Vue.use(inject, {
  ...config,
  Interceptors,
  env: {
    NODE_ENV: process.env.NODE_ENV
  }
  // STORAGE_NAME: 'LEAGUE_AGENT'
})

Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.title || to.name) {
    document.title = '联盟 - ' + (to.meta.title || to.name)
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
