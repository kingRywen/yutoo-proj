import Vue from 'vue'
// import '../examples/theme-chalk/src/index.scss'
import '../theme/index.css'
import App from './App.vue'
import router from './router'
import store from '../examples/store'
import demoBlock from '../examples/components/demo-block.vue'
import MainHeader from '../examples/components/header.vue'
import SideNav from '../examples/components/side-nav'
import inject from 'Plugins/inject'
import './components/shop/components'
import './directives'

import common from './components'

Vue.prototype.elementVersion = '2.4.0'
Vue.use(inject)
Vue.use(common)
Vue.component('demo-block', demoBlock)
Vue.component('main-header', MainHeader)
Vue.component('side-nav', SideNav)

// eslint-disable-next-line no-undef
GLOBAL.vbus = new Vue()

Vue.config.productionTip = false

Vue.mixin({
  computed: {
    sellerData() {
      return { platformId: 1 }
    },
    sellerId() {
      return 1
    },
    siteId() {
      return 1
    },
    platformId() {
      // let type = this.$store.state.common.routerType
      //          return type==='amazon'?1:2
      return 1
    },
    ebayPlatformId() {
      return 2
    }
  }
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
