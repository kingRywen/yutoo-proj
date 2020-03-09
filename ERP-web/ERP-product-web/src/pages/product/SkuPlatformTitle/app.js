import Vue from 'vue';
import App from './app.vue'
import Router from 'vue-router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(Router);

import SkuTitle from './skuTitle'
import TitleManagement from './title-management'

const router = new Router({
    routes: [
        {path: '/',component: SkuTitle},
        {path: '/skuTitle',component: SkuTitle},
        {path: '/title-management',name: 'title-management',component: TitleManagement},
    ]
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
