import Vue from 'vue'
import ElementUI from 'element-ui'
import VueProgressBar from 'vue-progressbar'
import '../theme/index.css'
import 'normalize.css/normalize.css'
import './style/index.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './api/axios.js'
import commonPlugin from './plugins/common'
import mixins from './plugins/mixins'
import VueLazyload from 'vue-lazyload'
import NonePage from './components/common/NonePage'

import ECharts from 'vue-echarts/components/ECharts.vue'
Vue.prototype.$axios = request
Vue.component('chart', ECharts)
Vue.component('none-page', NonePage)

// 进度条
const options = {
  color: '#bffaf3',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(ElementUI)
Vue.use(commonPlugin)
Vue.use(mixins)
Vue.use(VueProgressBar, options)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
