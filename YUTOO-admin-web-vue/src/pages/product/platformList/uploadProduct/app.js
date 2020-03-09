// import 'vue-beauty/package/style/vue-beauty.css';
//
// import 'vue-beauty/vb/style/core/index.less';
// import 'vue-beauty/vb/components/button/style/index.less';
// import 'vue-beauty/vb/components/form/style/index.less';
// import 'vue-beauty/vb/components/grid/style/index.less';
// import 'vue-beauty/vb/components/input/style/index.less';

import Vue from 'vue';
// import vueBeauty from 'vue-beauty';
import App from './app.vue'
import 'assets/style/common.less'
import element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Router from 'vue-router'



Vue.use(Router);
Vue.use(element);

import ProductInfo from './productInfo';
import ShopPutaway from './shopPutaway'

const router = new Router({
    routes: [
        {path: '/',component: ProductInfo},
        {path: '/productInfo',component: ProductInfo},
        {path: '/shopPutaway',name: 'shopPutaway',component: ShopPutaway},
    ]
})

window.vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
