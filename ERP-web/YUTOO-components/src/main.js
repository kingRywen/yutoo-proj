import Vue from 'vue'
import '../examples/theme-chalk/src/index.scss'
import App from './App.vue'
import router from './router'
import store from '../examples/store'
import demoBlock from '../examples/components/demo-block.vue'
import MainHeader from '../examples/components/header.vue'
import SideNav from '../examples/components/side-nav'
import inject from '../examples/api/inject'

import './directives'

import common from './components'

Vue.prototype.elementVersion = '2.4.0'
Vue.use(inject)
Vue.use(common)
Vue.component('demo-block', demoBlock)
Vue.component('main-header', MainHeader)
Vue.component('side-nav', SideNav)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
