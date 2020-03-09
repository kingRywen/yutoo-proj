import 'vue-beauty/package/style/vue-beauty.css'

import 'vue-beauty/vb/style/core/index.less'
import 'vue-beauty/vb/components/button/style/index.less'
import 'vue-beauty/vb/components/form/style/index.less'
import 'vue-beauty/vb/components/grid/style/index.less'
import 'vue-beauty/vb/components/input/style/index.less'

import Vue from 'vue'
import vueBeauty from 'vue-beauty'
import App from './app.vue'
// import 'assets/style/common.less'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Router from 'vue-router'

Vue.use(vueBeauty)
Vue.use(Router)
Vue.use(element)

import ProductInfo from './productInfo'
import ShopPutaway from './shopPutaway'
import UpperShelf from './components/UpperShelf'

const router = new Router({
  routes: [
    { path: '/', component: ProductInfo },
    { path: '/productInfo', component: ProductInfo },
    { path: '/shopPutaway', name: 'shopPutaway', component: ShopPutaway },
    { path: '/UpperShelf', name: 'UpperShelf', component: UpperShelf }
  ]
})

window.vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
